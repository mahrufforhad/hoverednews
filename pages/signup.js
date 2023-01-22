import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import $ from 'jquery';
import { auth, db, storage } from "../firebaseClient";
import { Router } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref } from 'firebase/storage';

// Components
import PageTransition from '../components/PageTransition'
import { useState } from 'react';

export default function Signup({ user, setShowPageTransition }) {
  PageTransition(setShowPageTransition);

  const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884')

  function signup(e){
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if(password !== confirmPassword){
      alert("Password does not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password).then(function(user){
      const uid = user.user.uid;

      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatar
      }).then(function(){
        setDoc(doc(db, "users", uid), {
          data: {
            email: email,
            uid: uid,
            createdAt: serverTimestamp(),
            name: name
          }
        }).then(() => {
          alert("Successfully signed up");
          window.location.href = "/profile";
        })
      })
    }).catch(function(error){
      error.code === "auth/email-already-in-use" ? showErrorMessage("Email is in use.") : error.code === "auth/operation-not-allowed" ? showErrorMessage("Signup error.") : error.code === "auth/network-request-failed" ? showErrorMessage("Network error.") : showErrorMessage(error.message); console.log(error.code, error.message);

      function showErrorMessage(message){
        alert(message)
      }
    });
  }

  function handleNameChange(e){
    if(avatar === 'https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884' || avatar.includes('https://ui-avatars.com/api/?name')){
      const name = e.target.value;

      if(name !== ''){
        const avatarURL = `https://ui-avatars.com/api/?name=${name}&size=128`;
        setAvatar(avatarURL);
      }
      else{
        setAvatar('https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884')
      }
    }
  }

  return (
    user?
    <></>
    :
    <>
    <div className='signup_page page'>
      <div className='container'>
        <div className='sl_form_container'>
          <form className='default signup_from' onSubmit={signup}>
            <div className='form_header'>
              <div className='title'>Create An Account</div>
            </div>
            
            <div className='profile_image_input'>
              <div className='profile_image'>
                <Image className='profile_image_preview' src={avatar} alt='Forhad Hossain' layout='fill' height={100} />
              </div>

              <label style={{marginTop: '20px', textAlign: 'center', display: 'block'}}>Upload Profile Picture</label>
            </div>
  
            <div className='inputs'>
              <div className='input_container'>
                <label className='label' htmlFor='name'>Name</label>
                <input className='input' id='name' type='name' name='name' placeholder='Enter your name' onChange={handleNameChange} required />
              </div>
  
              <div className='input_container'>
                <label className='label' htmlFor='email'>Email</label>
                <input className='input' id='email' type='email' name='email' placeholder='Enter your email' required />
              </div>
  
              <div className='input_container'>
                <label className='label' htmlFor='password'>Password</label>
                <input className='input' id='password' type='password' placeholder='Enter your password' required />
              </div>
  
              <div className='input_container'>
                <label className='label' htmlFor='confirmPassword'>Confirm Password</label>
                <input className='input' id='confirmPassword' type='password' placeholder='Enter your password again' required />
              </div>
            </div>
  
            <div className='actions'>
              <button className='submit_btn'>Signup</button>
            </div>
  
            <div className='sl_link'>
              <span>Already have an account?</span>
              <Link href='/login' className='sl_btn'>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
