import { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import Link from 'next/link';
import { db } from "../firebaseClient";
import { collection, getDocs, query, orderBy, limit, getDoc, doc, where } from "firebase/firestore";
import Head from 'next/head'
import Script from 'next/script';
import Image from 'next/image'
// Components
import NewsCard from '../components/NewsCard'
import PageTransition from '../components/PageTransition';
// Icons
import { GoodAfternoonIcon, GoodEveningIcon, GoodMorningIcon, GoodNightIcon } from '../assets/icons/GreetingIcons';

var $ = require("jquery");
if (typeof window !== "undefined") {
   window.$ = window.jQuery = require("jquery");
}

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export async function getServerSideProps() {
  const weatherRes = await fetch('https://api.weatherapi.com/v1/current.json?key=2d767e9221354e7196964133221504 &q=Chittagong&aqi=no');
  const weatherData = await weatherRes.json();

  const collRef = collection(db, "news");

  // Latest News
  const latestNews = []
  const latestNewsQuery = query(collRef, limit(8), orderBy("data.timestamp", "desc"), where("data.visibility", "==", "public"));
  
  await getDocs(latestNewsQuery).then((snapshot) => {
    snapshot.docs.forEach(doc => {
      var docData = doc.data().data;
      docData.id = doc.id;
      
      latestNews.push(JSON.stringify(docData));
    })
  });

  // Top News
  const topNews = []
  const topNewsQuery = query(collRef, limit(8), orderBy("data.views"), where("data.visibility", "==", "public"));
  
  await getDocs(topNewsQuery).then((snapshot) => {
    snapshot.docs.forEach(doc => {
      var docData = doc.data().data;
      docData.id = doc.id;
      
      topNews.push(JSON.stringify(docData));
    })
  });

  var newsTickerText = "";

  const docRef = doc(db, "news", "news-ticker");
  const docSnap = await getDoc(docRef);
  
  if(docSnap.exists()){
    newsTickerText = docSnap.data().data.newsTickerText;
  }

  return {
    props: {
      latestNews: latestNews,
      topNews: topNews,
      weatherData: weatherData,
      newsTickerText: newsTickerText,
    }
  }
}

export default function Home({ latestNews, topNews, weatherData, newsTickerText, setShowPageTransition }) {
  var latestNewsData = latestNews;
  var topNewsData = topNews;

  latestNewsData = latestNewsData.map(latestNews => JSON.parse(latestNews));
  topNewsData = topNewsData.map(topNews => JSON.parse(topNews));

  PageTransition(setShowPageTransition);

  // Get greeting text based on time
  const [greetingText, setGreetingText] = useState('');
  
  useEffect(() => {
    var currentTime = new Date().getHours();
    if (currentTime >= 0 && currentTime < 12) {
      setGreetingText("Good Morning");
    }
    else if (currentTime >= 12 && currentTime < 18) {
      setGreetingText("Good Afternoon");
    }
    else if (currentTime >= 18 && currentTime < 19) {
      setGreetingText("Good Evening");
    }
    else if(currentTime >= 19 && currentTime < 24) {
      setGreetingText("Good Night");
    }
  }, [])

  return (
    <div className='home_page page'>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3563302535835946" crossorigin="anonymous" />
      <Head>
        <title>Hovered News</title>
        <meta property="og:title" content="Hovered News" />
        <meta property="og:description" content="Latest news about Bangladesh, International, Sports, Education, Technology." />
        <meta property="og:url" content="https://hoverednews.vercel.app/" />
      </Head>
      
      <h1 style={{display: "none"}}>Hovered News</h1>
      <p style={{display: "none"}}>Latest news about Bangladesh, International, Sports, Education, Technology.</p>

      <div className='container'>
        <header>
          <div className="header_left">
            <div className="weather">
              <div className="greetings">
                <div className="graphics">
                  {
                    greetingText === "Good Morning" ?
                    <GoodMorningIcon /> :
                    greetingText === "Good Afternoon" ?
                    <GoodAfternoonIcon /> :
                    greetingText === "Good Evening" ?
                    <GoodEveningIcon /> :
                    <GoodNightIcon />
                  }
                </div>
                <div className="greeting-text select_n">{greetingText}</div>
              </div>
  
              <div className="weather_cast">
                <div className="info">
                  <div className="left">
                    <div className="graphics">
                      <Image src={'https:' + weatherData.current.condition.icon} alt='Weather Condition' height={90} width={90} />
                    </div>
                    <div className="details">
                      <div className="text">{weatherData.current.condition.text}</div>
                      <div className="location">{weatherData.location.name}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="temperature"><span>{weatherData.current.temp_c}°</span>c</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header_right">
            <OwlCarousel
              className='owl-theme'
              items={1}
              autoPlay={true}
              autoplayHoverPause={true}
              loop={true}
              autoplaySpeed={1000}
              responsive={{
                1800: {items: 1},
                600: {items: 1},
                0: {items: 1}
              }}
              dots={false}
            >
              {
                topNewsData.reverse().map((news, index) => {
                  return (
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
            </OwlCarousel>
          </div>
        </header>
  
        {/* News Ticker */}
        <section className="news_ticker">
          <div className="title select_n">Highlights</div>
          <marquee>{newsTickerText}</marquee>
        </section>
  
        {/* Trending News Section */}
        <section className="latest_news grid_news_section">
          <div className='section_header'>
            <h2>Latest News</h2>
          </div>

          <div className='section_content'>
            <div className='news_container'>
              {
                latestNewsData.map((news, index) => {
                  return (
                    <NewsCard 
                      type="vertical"
                      thumbnail={news.thumbnail}
                      title={news.title}
                      description={news.description}
                      index={index}
                      link={"/news/"+news.id}
                      key={index}
                    />
                  )
                })
              }
            </div>
          </div>
        </section>
        {/* Trending News Section */}

        {/* News Categories Section */}
        <section className='news_categories'>
          <div className='section_content m_n'>
            <div className='categories_container'>
              <Link href='topic/education'>
                <div className='card education'>
                <h2>Education</h2>
                </div>
              </Link>
              <Link href='topic/international'>
                <div className='card international'>
                  <h2>International</h2>
                </div>
              </Link>
              <Link href='topic/bangladesh'>
                <div className='card bangladesh'>
                  <h2>Bangladesh</h2>
                </div>
              </Link>
              <Link href='topic/business'>
                <div className='card business'>
                  <h2>Business</h2>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {/* News Categories Section End */}

        {/* Top News Section */}
        <section className='top_news grid_news_section'>
          <div className='section_header'>
            <h2>Top News</h2>
          </div>

          <div className='section_content'>
            <div className='news_container'>
              {
                topNewsData.map((news, index) => {
                  return (
                    <NewsCard 
                      type="vertical"
                      thumbnail={news.thumbnail}
                      title={news.title}
                      description={news.description}
                      index={index}
                      link={"/news/"+news.id}
                      key={index}
                    />
                  )
                })
              }
            </div>
          </div>
        </section>
        {/* Top News Section End */}
      </div>
    </div>
  )
}
