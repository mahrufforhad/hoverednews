import Script from 'next/script'
// Components
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

export default function Layout({ user, uid, avatar, children, currentUser, showPageTransition, showSnackbar, snackbarData, setShowSnackbar }) {
  
  return (
    <>
      <>
        <div className={showPageTransition === 'hide'? '' : showPageTransition? 'page_transition active' : 'page_transition'}>
        </div>
        {
          showPageTransition?
          <div className="page_transition_line"></div>
          : ''
        }
      </>

      {
        <Snackbar open={showSnackbar} autoHideDuration={snackbarData.duration} onClose={() => {setShowSnackbar(false)}}>
          <Alert onClose={() => {setShowSnackbar(false)}} severity={snackbarData.type} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar>
      }

      <div className="app">
        <Script src="https://kit.fontawesome.com/19b88b9e2d.js" crossorigin="anonymous" />
        <Navbar user={user} currentUser={currentUser} avatar={avatar} uid={uid} />
  
        <div className="page_body">
          {children}
          <Footer />
        </div>
      </div>
    </>
  )
}