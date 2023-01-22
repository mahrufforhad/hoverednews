import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsCard(props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={props.type === "vertical" ? "news_card news_card_2 " + props.index : "news_card "+props.index}>
      {/* {
        props.cardTitle? <Link href="/business" className="card-title"><props.cardTitleIcon /> Business</Link> : <></>
      } */}
      <div className={imageLoaded? "thumbnail" : "thumbnail blur"}>
        <Image src={props.thumbnail} alt="News Banner" onLoadingComplete={() => {setTimeout(() => {setImageLoaded(true)}, 500)}} layout="fill" />
      </div>
      <div className="infos">
        <Link href={props.link}><a className="title">{props.title}</a></Link>
        <p className="short-description">{props.description}</p>
        {/* <div className='actions'>
          <Link className='btn_primary' to={props.link}>Read More</Link>
        </div> */}
      </div>
    </div>
  )
}
