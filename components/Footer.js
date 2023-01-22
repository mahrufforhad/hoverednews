import { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { db } from '../firebaseClient';
import { arrayUnion, doc, increment, updateDoc } from 'firebase/firestore';

export default function Footer() {
  const [year, setyear] = useState(new Date().getFullYear());

  function subscribe(e){
    e.preventDefault();

    updateDoc(doc(db, 'app', 'subscribers'), {
      "data.subscribers": arrayUnion(e.target.email.value)
    }).then(() => {
      alert("Subscribed successfully!");
    })
  }

  return (
    <footer>
      <div className='container'>
        <div className='footer_content'>
          <div className='left'>
            <div className='section info'>
              <div className='section_header'>
                <Image src={require('../assets/images/branding.png')} width={128.08} height={40} alt='Logo' />
              </div>
              <div className='section_content'>
                <ul>
                  <li><Link href='/'>Home</Link></li>
                  <li><Link href='/about'>About</Link></li>
                  <li><Link href='/contact'>Contact</Link></li>
                  <li><Link href='/privacy'>Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
  
            <div className='section quick_links'>
              <div className='section_header'>
                <h2>Quick Links</h2>
              </div>
  
              <div className='section_content'>
                <ul>
                  <li><Link href='/topic/bangladesh'>Bangladesh</Link></li>
                  <li><Link href='/topic/international'>International</Link></li>
                  <li><Link href='/topic/sports'>Sports</Link></li>
                  <li><Link href='/topic/education'>Education</Link></li>
                  <li><Link href='/topic/business'>Business</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className='right'>
            <div className='section subscribe'>
              <div className='section_header' style={{marginBottom: '5px'}}>
                <h2>Subscribe Newsletter</h2>
              </div>
              <div className='section_content'>
                <form className='newsletter_subscribe_form default' onSubmit={subscribe}>
                  <div className='form_header'>
                    <p>Subscribe to our newsletter to get daily updates.</p>
                  </div>
                  <div className='inputs' style={{marginTop: '10px'}}>
                    <div className='input_container'>
                      <input type='text' name='email' placeholder='Enter your email' />
                    </div>
                  </div>

                  <div className='actions' style={{marginTop: '15px'}}>
                    <button className='submit_btn'>Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
  
            <div className='section social_links'>
              <div className='section_header'>
                <h2>Social Links</h2>
              </div>
              <div className='section_content'>
                <ul className='links'>
                  <li><a href='#'>Facebook</a></li>
                  <li><a href='#'>Twitter</a></li>
                  <li><a href='#'>Instagram</a></li>
                  <li><a href='#'>Linkedin</a></li>
                </ul>
                
                <div className='image'>
                  <Image src={require('../assets/images/hovered.png')} width={80} height={38.8} alt='Hovered' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='footer_bottom'>
          <p className='copyright'>&copy; {year} HOVERED NEWS<br /><span>All rights reserved.</span></p>
        </div>
      </div>
    </footer>
  )
}