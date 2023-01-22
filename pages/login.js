import React, { useEffect } from 'react'
import Link from 'next/link';
import { auth } from '../firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Router from 'next/router';
// Components
import PageTransition from '../components/PageTransition'

export default function Login({ user, setShowPageTransition }) {
  PageTransition(setShowPageTransition);

  function login(e){
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password).then(function(user){
      window.location.href = "/profile";
    }).catch(function(error){
      var errorMessage = error.code === "auth/wrong-password" ? "Wrong Password" : error.code === "auth/user-not-found" ? "No user was found." : error.code === "auth/network-request-failed" ? "Network Error. Please try again." : error.code === "auth/user-disabled" ? "You can't login because your account is disabled." : error.message;
      
      alert(errorMessage);
    })
  }

  useEffect(() => {
    if(user){
      Router.push("/");
    }
  }, [])

  return (
    user?
    <></>
    :
    <>
    <div className='login_page page'>
      <div className='container'>
        <div className='sl_form_container'>
          <form className='default login_form' onSubmit={login}>
            <div className='form_header'>
              <div className='title'>Login To Your Account</div>
            </div>
  
            <div className='inputs'>
              <div className='input_container'>
                <label className='label' htmlFor='email'>Email</label>
                <input className='input' id='email' type='email' name='email' placeholder='Enter your email' required />
              </div>
  
              <div className='input_container'>
                <label className='label' htmlFor='password'>Password</label>
                <input className='input' id='password' type='password' name='password' placeholder='Enter your password' required />
              </div>
            </div>
  
            <div className='actions'>
              <button className='submit_btn'>Login</button>
            </div>
  
            <div className='sl_link'>
              <span>Or, Create An Account</span>
              <Link href='/signup' className='sl_btn'>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
