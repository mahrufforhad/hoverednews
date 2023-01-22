import { useEffect, useState } from 'react';
import { auth } from '../firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import Head from 'next/head'
import Script from 'next/script';
// Components
import Layout from '../components/Layout'
// CSS
import '../assets/owl carousel/owl.carousel.min.css';
import '../assets/owl carousel/owl.theme.default.min.css';
import '../styles/globals.css'
import '../styles/page-transition.css'
import '../styles/form.css'
import '../styles/navbar.css'
import '../styles/news-card.css'
import '../styles/comments.css'
import '../styles/comment-card.css'
import '../styles/footer.css'
import '../styles/404.css'
import '../styles/home.css'
import '../styles/news.css'
import '../styles/topic.css'
import '../styles/my-account.css'
import '../styles/about.css'
import '../styles/contact.css'
import '../styles/privacy.css'
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

function MyApp({ Component, pageProps }) {
  const [showPageTransition, setShowPageTransition] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({duration: 0, type: '', message: ''});

  useEffect(() => {
    updateDoc(doc(db, 'app', 'adminData'), {
      "data.siteVisits": increment(1)
    })
  }, []);

  // Handle Auth
  const [user, setUser] = useState('loading');
  const [currentUser, setCurrentUser] = useState({
    displayName: '',
    email: ''
  });
  const [uid, setUID] = useState('');
  const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(true);
        setUID(currentUser.uid);
        setCurrentUser(currentUser)

        setAvatar(currentUser.photoURL)
      } else {
        setUser(false);
        setUID('');
        setCurrentUser({
          displayName: 'Anonymous',
          email: ''
        })

        setAvatar('https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884')
      }
    })
  }, []);

  return (
    <Layout user={user} uid={uid} avatar={avatar} currentUser={currentUser} showPageTransition={showPageTransition} showSnackbar={showSnackbar} setShowSnackbar={setShowSnackbar} snackbarData={snackbarData}>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3563302535835946" crossorigin="anonymous" />
      <Head>
        <meta name="google-site-verification" content="mqdXZIrtnfIDj924tB40w9VUzTsAoG3WCUlBhvjvghE" />
      </Head>

      <p style={{display: "none"}}>Latest news about Bangladesh, International, Sports, Education, Technology.</p>
      
      <Component {...pageProps} user={user} uid={uid} currentUser={currentUser} avatar={avatar} setAvatar={setAvatar} setShowPageTransition={setShowPageTransition} setShowSnackbar={setShowSnackbar} setSnackbarData={setSnackbarData} />
    </Layout>
  )
}

export default MyApp
