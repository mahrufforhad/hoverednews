import React from 'react'
import Head from 'next/head'
// Components
import PageTransition from '../components/PageTransition'

export default function About({ setShowPageTransition }) {
  PageTransition(setShowPageTransition);

  return (
    <div className='about_page page'>
      <Head>
        <title>About Us । Hovered News</title>
        <meta property="og:title" content="About । Hovered News" />
        <meta property="og:description" content="Latest news about Bangladesh, International, Sports, Education, Technology." />
        <meta property="og:url" content="https://hoverednews.vercel.app/about" />
      </Head>

      <div className='container'>
        <div className='header'>
          <h1>About Us</h1>
        </div>

        <div className='about_text'>
          <p>Hovered News is an online based news publishing company by Hovered. Bangladesh is changing. It is time for a new generation of Bangladeshis to be heard, for their vision for our country to be promoted. Dhaka Tribune is here to be the platform for that new voice, and new vision.<br /><br />The editorial team is totally committed to delivering accurate and impartial news with the aim of informing the public debate and enabling Bangladeshis to make educated choices.<br /><br />Our pledge to those we serve is to seek the truth, deliver the facts and offer relevant context and analysis where appropriate.<br /><br />Our tone will be non-judgemental, objective and fair. We aim to include all relevant opinions and ensure that no significant strand of thought is neglected.<br /><br />We will strive to dig where others don’t, give voice to the voiceless. We all hold all quarters who bear a public responsibility – government, corporates, NGO’s and many others – accountable on behalf of you, our audience, and indeed all citizens.<br /><br />We aim to practice journalism that is professional, reliable, dependable and transparent.<br /><br />We seek to enable maximum participation in the national dialog, and to lead to collective decisions that will be driven by a new generation’s vision of the country, not the biases of any political party or coterie.<br /><br />We are committed to the values at the foundation of this country, in particular, national sovereignty, democracy and secularism and also to building a prosperous, equitable and tolerant society.<br /><br />We will speak for human and civil rights, not for select groups but for all citizens, but also nurture open and respectful debate on the best ways to attain all such goals.<br /><br />Our newspaper and website are here to offer a canvas for Bangladeshis to showcase their best ideas to help transform the country into a knowledge-based society where citizens can express their creativity and ingenuity.<br /><br />As a new generation comes of age, and soars to new heights, we wish to be their partners to help Bangladesh make its long-awaited mark in the world.</p>
        </div>
      </div>
    </div>
  )
}
