import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import $ from 'jquery'
import { auth, storage } from '../../firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
// Components
import PageTransition from '../../components/PageTransition'

export default function EditProfile({ avatar, currentUser, setShowPageTransition, uid, setAvatar }) {
  PageTransition(setShowPageTransition);

  function handleProfileImageChange(e){
    const file = e.target.files[0];
    const fileName = 'profile_picture_'+uid;

    document.querySelector('.profile_image_preview').src = URL.createObjectURL(file);
    document.querySelector('.profile_image .loading').classList.add('show');

    const compressionOptions = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 350,
      useWebWorker: true
    }
    
    imageCompression(file, compressionOptions).then(function(compressedFile) {
      const storageRef = ref(storage, "/Profile Pictures/"+fileName);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
    
      uploadTask.on('state_changed', (snapshot) => {
        
      }, (error) => {
        document.querySelector('.profile_image .loading').classList.remove('show');
        alert('Error Please try again');
        console.log(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL
          }).then(() => {
            document.querySelector('.profile_image .loading').classList.remove('show');
            setAvatar(URL.createObjectURL(file));
          })
        });
      });
    });
  }
  
  function logout(){
    auth.signOut().then(function(){
      window.location.href = "/";
    })
  }

  function updateProfileInfo(e){
    e.preventDefault();

    if(e.target.name.value === currentUser.displayName){
      return;
    }
    
    updateProfile(auth.currentUser, {
      displayName: e.target.name.value
    }).then(() => {
      document.querySelectorAll('.profile_info .name').forEach((name) => {
        name.innerHTML = e.target.name.value;
      })
    })
  }

  function handleNameChange(e){
    if(e.target.value.length > 25){
      e.target.blur()
      e.target.value = e.target.value.substring(0, 25)
    }
  }

  return (
    <div className='edit_profile_page my_account_page page'>
      <div className='container'>

      <div className='wrapper'>
          <div className='side_content'>
            <div className='profile_image'>
              <Image src={avatar} className='profile_image_preview' alt='Forhad Hossain' width={100} height={100} />
              <button className='edit_btn fas fa-pen' onClick={() => {$('.profile_image_input').click()}}></button>
              <div className='loading'>
                <span className='fas fa-spinner fa-spin'></span>
              </div>
              <input type='file' accept='image/*' className='profile_image_input' style={{display: 'none'}} onChange={handleProfileImageChange} required />
            </div>
            <div className='profile_info'>
              <span className='name'>{currentUser.displayName}</span>
              <span className='email'>{currentUser.email}</span>
            </div>

            <ul className='links'>
              <li><Link href='/profile'>Profile</Link></li>
              <li className='active'><Link href='/edit-profile'>Edit Profile</Link></li>
              <li><Link href='/profile/change-password'>Change Password</Link></li>
              <li><a onClick={logout}>Logout</a></li>
            </ul>
          </div>
  
          <div className='main_content'>
            <form className='default' style={{maxWidth: '300px'}} onSubmit={updateProfileInfo}>
              <div className='form_header'>
                <h2>Edit Profile Info</h2>
              </div>

              <div className='inputs'>
                <div className='input_container'>
                  <label htmlFor='name'>Edit You Name</label>
                  <input type='text' name='name' id='name' placeholder='Write you name' onChange={handleNameChange} requried />
                </div>
              </div>

              <div className='actions' style={{marginTop: '20px'}}>
                <button className='submit_btn'>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
