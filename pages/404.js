import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
// Components
import PageTransition from '../components/PageTransition'

export default function Custom404({ setShowPageTransition }) {
  PageTransition(setShowPageTransition);

  return (
    <div className='custom_404_page page'>
      <Head>
        <title>Page Not Found । Hovered News</title>
      </Head>

      <div className='container'>
        <div className='header'>
          <Image src={require('../assets/images/page\ banners/404.png')} width={200} height={200} alt='404' />
          <h1>Page Not Found!</h1>
        </div>
      </div>
    </div>
  )
}
