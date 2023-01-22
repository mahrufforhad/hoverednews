import React from 'react'
import Head from 'next/head'
import Script from 'next/script'
// Components
import NewsCard from '../../components/NewsCard'
import { collection, getDocs, where, query, limit, orderBy } from 'firebase/firestore'
import { db } from '../../firebaseClient'
import PageTransition from '../../components/PageTransition'
// Icons
import { BangladeshIcon, BusinessIcon, EducationIcon, InternationalIcon, SportsIcon, TechnologyIcon } from '../../assets/icons/NavIcons';

export async function getServerSideProps(context){
  const topic = context.params.topic;
  const topicSplitArr = topic.split(" ");
  
  for (var i = 0; i < topicSplitArr.length; i++) {
    topicSplitArr[i] = topicSplitArr[i].charAt(0).toUpperCase() + topicSplitArr[i].slice(1);
  }

  const topicTitle = topicSplitArr.join(" ");

  const news = [];

  const collRef = collection(db, "news");
  console.log(topicTitle)
  const q = query(collRef, limit(10), where('data.category', 'array-contains', topicTitle), orderBy("data.timestamp", "desc"));
  
  await getDocs(q).then((snapshot) => {
    snapshot.docs.forEach(doc => {
      var docData = doc.data().data;
      docData.id = doc.id;
      console.log(doc)
      news.push(JSON.stringify(docData));
    })
  });

  return {
    props: {
      topic: topic,
      topicTitle: topicTitle,
      news: news
    }
  }
}

export default function Topic({ topic, topicTitle, news, setShowPageTransition }) {
  var newsData = news;
  newsData = newsData.map(news => JSON.parse(news));
  
  PageTransition(setShowPageTransition);

  return (
    <div className='topic_page page'>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3563302535835946" crossorigin="anonymous" />
      <Head>
        <title>{topicTitle} । Hovered News</title>
      </Head>

      <div className='container'>
        <div className={'header '+topic}>
          <div className='details'>
            {
              topicTitle === 'Bangladesh' ?
              <BangladeshIcon />
              : topicTitle === 'International' ?
              <InternationalIcon />
              : topicTitle === 'Business' ?
              <BusinessIcon />
              : topicTitle === 'Sports' ?
              <SportsIcon />
              : topicTitle === 'Education' ?
              <EducationIcon />
              : topicTitle === 'Technology' ?
              <TechnologyIcon />
              : ''
            }
            <h1 className='title'>{topicTitle}</h1>
          </div>
        </div>

        <div className='news_container'>
          {
            newsData.map((news, index) => {
              return (
                index < 2 ?
                <NewsCard 
                  thumbnail={news.thumbnail}
                  title={news.title}
                  description={news.description}
                  link={"/news/"+news.id}
                  index={index}
                  key={index}
                />
                :
                <NewsCard
                  thumbnail={news.thumbnail}
                  title={news.title}
                  description={news.description}
                  link={"/news/"+news.id}
                  index={index}
                  key={index}
                />
              )
            })
          }
        </div>

        {
          newsData.length === 0 ?
          <div className='no_news'>
            <h2>No News</h2>
          </div>
          : ''
        }
      </div>
    </div>
  )
}
