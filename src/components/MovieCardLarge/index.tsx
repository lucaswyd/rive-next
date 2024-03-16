import { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import Link from 'next/link';
import { motion } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import axiosFetch from '@/Utils/fetch';


const MovieCardLarge = ({ data, media_type }: any) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [genreListMovie, setGenreListMovie] = useState([]);
  const [genreListTv, setGenreListTv] = useState([]);
  const year = new Date(data?.release_date).getFullYear();
  const lang = data?.original_language;
  let Genres: Array<string> = [];
  data?.genre_ids?.map((ele: number) => {
    if (data?.media_type === "movie") {
      genreListMovie?.map((val: any) => {
        if (val?.id === ele) {
          Genres.push(val?.name);
        }
      })
    }
    else if (data?.media_type === "tv") {
      genreListTv?.map((val: any) => {
        if (val?.id === ele) {
          Genres.push(val?.name);
        }
      })
    }
  });
  console.log({ Genres });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const gM = await axiosFetch({ requestID: "genresMovie" });
        const gT = await axiosFetch({ requestID: "genresTv" });
        setGenreListMovie(gM.genres);
        setGenreListTv(gT.genres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <Link key={data.id} href={`${data.media_type === "person" ? "/person?id=" + data.id : "/detail?type=" + data.media_type + "&id=" + data.id}`} className={styles.MovieCardSmall}>
      <div className={`${styles.img} skeleton`}>
        <motion.img
          key={data.id}
          src={process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + (data?.poster_path || data.profile_path)}
          initial={{ opacity: 0 }}
          animate={{
            opacity: imageLoading ? 0 : 1
          }}
          height="100%"
          width="100%"
          exit="exit"
          className={`${styles.img} skeleton`}
          onLoad={() => { setImageLoading(false); }}
          loading="lazy"
          style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
        />
      </div>
      <div className={`${styles.metaData}`}>
        <h1>{data?.title || data?.name || <Skeleton />}</h1>
        <p>{data?.media_type}{!Number.isNaN(year) ? ` • ${year}` : null} {lang !== undefined ? ` • ${lang}` : null}</p>
        {
          Genres.join(", ") // || <Skeleton />
        }
      </div>
    </Link>
  )
}

export default MovieCardLarge;