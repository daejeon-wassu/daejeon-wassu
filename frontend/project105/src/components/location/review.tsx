"use client";

// import CommunityCard from "../main/community/communitycard";

import style from "./review.module.css";
import axios from "axios";

export default function Review() {
  // 방문후기 조회 요청 axios

  return (
    <div className={style.container}>
      {/* <CommunityCard />
      <CommunityCard />
      <CommunityCard />
      <CommunityCard /> */}
      <button className={style.more}>더보기</button>
    </div>
  );
}
