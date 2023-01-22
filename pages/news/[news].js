import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import { doc, getDoc, increment, collection, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseClient";
// Components
import Comments from "../../components/Comments";
import PageTransition from '../../components/PageTransition';

export async function getServerSideProps(context) {
  const docRef = doc(db, 'news', context.params.news);
  const docSnap = await getDoc(docRef);
  var newsData = 'wait';
  
  if (docSnap.exists()) {
    newsData = docSnap.data();
    
  } else {
    newsData = 'not found';
  }

  return {
    props: {
      newsData: JSON.stringify(newsData),
    }
  }
}

export default function News({ user, uid, newsData, setShowPageTransition, setShowSnackbar, setSnackbarData }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [data, setData] = useState(JSON.parse(newsData).data);

  PageTransition(setShowPageTransition);

  useEffect(() => {
    if(JSON.parse(newsData) === 'not found') {
      return;
    }
    else{
      updateDoc(doc(db, 'news', data.id), {
        "data.views": increment(1)
      })
    }

  }, []);

  // Comments
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // get comments from docs
    getDocs(query(collection(doc(db, 'news', data.id), 'comments'), orderBy('data.commentedAt', 'desc'))).then((commentDocs) => {
      setComments([])
      
      commentDocs.forEach((comment) => {
        const commentData = comment.data().data;
        console.log(commentData)
        
        setComments(oldComments => [...oldComments, commentData]);
      })
    })
  }, [])

  console.log(comments)

  function share(){
    const shareData = {
      title: data.title,
      text: data.title,
      url: 'https://hoverednews.vercel.app/news/' + data.id,
    }

    if (navigator.share) {
      navigator.share(shareData).then(() => {
        console.log('Successful share')
      }).catch((error) => {
        console.log('Error sharing', error)
      })
    }
    else{
      console.log('Share not supported')
    }
  }

  function copyURL(){
    navigator.clipboard.writeText('https://hoverednews.vercel.app/news/' + data.id).then(() => {
      setShowSnackbar(true);
      setSnackbarData({
        duration: 6000,
        message: 'URL copied to clipboard',
        type: 'success'
      })
    })
  }

  return (
    <div className="news_page page">
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3563302535835946" crossorigin="anonymous" />
      {
        JSON.parse(newsData) === 'not found' ?
        <div className="container">
          <Head>
            <title>News Not Found । Hovered News</title>
          </Head>
          
          <div className="not_found">
            <Image src={require('../../assets/images/page banners/404.png')} alt="Not Found" width={200} height={200} />
            <h1>News Not Found</h1>
          </div>
        </div>
        :
        <>
          <Head>
            <title>{data.title} । Hovered News</title>
            <meta property="og:image" content={data.thumbnail} />
            <meta property="og:title" content={data.title} />
            <meta property="og:description" content={data.description} />
            <meta property="og:url" content={`https://hoverednews.vercel.app/news/${data.id}`} />
          </Head>
    
          <div className="container">
            <div className="header">
              <h1 className="title">{data.title}</h1>
              <div className="infos">
                <div className="info views">
                  <i className="fa-solid fa-eye" /> {data.views + 1}
                </div>

                <div className="info">
                  {
                    data.category.map((category, index) => {
                      return (
                        index === data.category.length - 1 ?
                        <Link href={"/topic/"+category}><a className="category">{category}</a></Link>
                        :
                        <Link href={"/topic/"+category}><a className="category">{category}, </a></Link>
                      )
                    })
                  }
                </div>
                <div className="date info">{data.date}</div>
              </div>

              <div className="actions">
                <a onClick={share} className="select_n"><i className="fa-solid fa-share" /></a>
                <a onClick={copyURL} className="select_n"><i className="fa-regular fa-copy" /></a>
              </div>
            </div>
    
            <div className="content">
              <div className="news_content">
                {
                  data.showThumbnail === false?
                  ''
                  :
                  <>
                    <div className={imageLoaded? "image_container" : "image_container blur"}>
                      <Image src={data.thumbnail} onLoadingComplete={() => {setTimeout(() => {setImageLoaded(true)}, 500)}} layout="fill" className="image" alt="News Banner" />
                    </div>
                    <br />
                  </>
                }
                <div dangerouslySetInnerHTML={{__html: data.content}} />
              </div>
    
              <div className="action_content">
                <Comments user={user} uid={uid} newsId={data.id} commentsData={comments} />
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}
