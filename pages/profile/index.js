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

export default function Profile({ user, currentUser, uid, avatar, setAvatar, setShowPageTransition }) {
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

  return (
    <div className='profile_page my_account_page page'>
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
              <li className='active'><Link href='/profile'>Profile</Link></li>
              <li><Link href='/profile/edit-profile'>Edit Profile</Link></li>
              <li><Link href='/profile/change-password'>Change Password</Link></li>
              <li><a onClick={logout}>Logout</a></li>
            </ul>
          </div>
  
          <div className='main_content'>
            <section className='dashboard'>
              <p>Hello <span className='bold'>forhadhossain60</span></p>
    
              <div className='dashboard_links'>
                <Link href='/edit-profile'>
                  <div className='card'>
                    <div className='icon'>
                      <span className='fas fa-th'></span>
                    </div>
                    <div className='title'>Edit Profile</div>
                  </div>
                </Link>
    
                <a className='card' onClick={logout}>
                  <div className='icon'>
                    <span className='fas fa-sign-out-alt'></span>
                  </div>
                  <div className='title'>Logout</div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
