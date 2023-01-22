import React from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseClient';
// Components
import PageTransition from '../components/PageTransition'

export default function Contact({ setShowPageTransition, currentUser }) {
  PageTransition(setShowPageTransition);

  function sendMessage(e){
    e.preventDefault();

    addDoc(collection(db, 'contacts'), {
      data: {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
        uid: currentUser.uid,
        date: serverTimestamp()
      }
    }).then(() => {
      document.querySelector('.contact_form').reset()
      alert('Message sent!');
    }).catch((error) => {
      alert('Something went wrong. Please try again.')
    })
  }

  return (
    <div className='contact_page page'>
      <div className='container'>
        <div className='header'>
          <h1>Contact Us</h1>
        </div>

        <div className='map'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.040553694544!2d91.81285531532825!3d22.352097546660424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd91a24a02a19%3A0xce7ea8d88967fea1!2sHovered!5e0!3m2!1sen!2sbd!4v1650620126657!5m2!1sen!2sbd" width={600} height={450} style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>

        <div className='section contact_info'>
          <div className='content'>
            <div className='item'>
              <div className='icon'>
                <span className='fas fa-map-marker-alt'></span>
              </div>
              <div className='name'>Address</div>
              <span>59/1 Salam Mension, Bagghona, Chattogram</span>
            </div>

            <div className='item'>
              <div className='icon'>
                <span className='fas fa-mobile-alt'></span>
              </div>
              <div className='name'>Phone Number</div>
              <span>+880 1724904320</span>
            </div>

            <div className='item'>
              <div className='icon'>
                <span className='fas fa-envelope-square'></span>
              </div>
              <div className='name'>Email Address</div>
              <span>hoverednews@gmail.com</span>
            </div>
          </div>
        </div>

        <div className='wrapper'>
          <div className='left'>
            <section className='section'>
              <div className='section_header'>
                <h2>Send Us a Message</h2>
              </div>
              
              <form className='contact_form default bg_w' onSubmit={sendMessage}>
                <div className='inputs'>
                  <div className='input_container'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' id='name' name='name' placeholder='Your Name' />
                  </div>
                  <div className='input_container'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Your Email' />
                  </div>
                  <div className='input_container'>
                    <label htmlFor='subject'>Message</label>
                    <textarea id='subject' name='message' placeholder='Your Message'></textarea>
                  </div>
                </div>

                <div className='actions'>
                  <button className='submit_btn'>Send Message</button>
                </div>
              </form>
            </section>
          </div>

          <div className='right'>
            <section className='faqs section'>
              <div className='section_header'>
                <h2>Frequently Asked Questions</h2>
              </div>
               
              <div className='content'>
                <div className='item'>
                  <div className='toggle_btn 1' onClick={()=> {$('.toggle_btn.1').toggleClass('show')}}>Do we pulish articles from users? <span className='fas fa-caret-down'></span></div>
                  <div className='toggle_content'>
                    <p>Yes! You can send your article to our mail "hoverednews@gmail.com" or send us your article via the contact form.</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='toggle_btn 2' onClick={()=> {$('.toggle_btn.2').toggleClass('show')}}>Which data we collect from user? <span className='fas fa-caret-down'></span></div>
                  <div className='toggle_content'>
                    <p>We collect user's name, profile picture and email if they submit our newsletter subscription form.</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='toggle_btn 3' onClick={()=> {$('.toggle_btn.3').toggleClass('show')}}>Can you visit our office location? <span className='fas fa-caret-down'></span></div>
                  <div className='toggle_content'>
                    <p>Yes. You can visit our office location for any dealing and query.</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='toggle_btn 4' onClick={()=> {$('.toggle_btn.4').toggleClass('show')}}>Do we collect any private data? <span className='fas fa-caret-down'></span></div>
                  <div className='toggle_content'>
                    <p>No we don't collect any private data. We only collect your email, name and profile picture information. We are always transparent about what we collect from you.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
