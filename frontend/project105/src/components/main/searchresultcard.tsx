"use client";

import { LocationData } from "@/types";
import { useRouter } from "next/navigation";
import style from "./searchresultcard.module.css";

interface SearchResultCardProps {
  result: LocationData;
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
  const router = useRouter();

  const toLocaDetail = () => {
    router.push(`/location/${result.id}`);
  };

  return (
    <div className={style.cardcontainer} onClick={toLocaDetail}>
      <div className={style.contentbox}>
        {result.images.length === 0 ? (
          <img
            className={style.img}
            src="/images/default.png"
            alt="defaultimage"
          />
        ) : (
          <img
            className={style.img}
            src={result.images[0].image}
            alt="locationimage"
          />
        )}
        <div className={style.textcontainer}>
          <p className={style.placetitle}>{result.spotName}</p>
          <p className={style.placedesc}>{result.spotDescription}</p>
          <div className={style.iconbox}>
            <img className={style.icon} src="/images/pencil.png" alt="" />
            <div className={style.iconnumber}>{result.reviewCount}</div>
            <img className={style.icon} src="/images/heart.png" alt="" />
            <div className={style.iconnumber}>{result.liked}</div>
          </div>
          <div className={style.location}>{result.spotAddress}</div>
        </div>
      </div>
      <div className={style.br}></div>
    </div>
  );
}
