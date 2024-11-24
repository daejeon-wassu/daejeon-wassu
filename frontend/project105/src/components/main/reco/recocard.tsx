"use client";

import { RecoData } from "@/types";
import style from "./recocard.module.css";
import { useRouter } from "next/navigation";

interface RecoCardProps {
  reco: RecoData;
  index: number;
}

export default function RecoCard({ reco, index }: RecoCardProps) {
  const router = useRouter();

  const toDetail = () => {
    router.push(`/location/${reco.spotId}`);
  };
  return (
    <div className={style.card} onClick={toDetail}>
      <div className={style.boxer}>
        <div className={style.number}>{index + 1}</div>
        <div className={style.contentbox}>
          <div>
            <div className={style.title}>{reco.spotName}</div>
            <div className={style.desc}>{reco.spotDescription}</div>
          </div>
          <div>
            <div className={style.iconbox}>
              <img className={style.icon} src="/images/pencil.png" alt="" />
              <p className={style.icontext}>{reco.reviewCount}</p>
              <img className={style.icon} src="/images/heart.png" alt="" />
              <p className={style.icontext}>{reco.likeCount}</p>
            </div>
            <div className={style.address}>{reco.spotAddress}</div>
          </div>
        </div>
      </div>
      <img className={style.img} src={reco.thumbnail} alt="" />
    </div>
  );
}
