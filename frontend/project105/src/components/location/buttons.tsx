"use client";

import { useState } from "react";
import style from "./buttons.module.css";

export default function Buttons() {
  // 찜한지 안한지 조회하는 요청
  const [isLike, setIsLike] = useState(false);

  // 찜하기 요청을 제외하고는 모달 띄우는 걸로

  // 방문 후기도 못보게

  return (
    <div className={style.container}>
      {/* 찜하기 조건 처리 해서 좋아요 기능 구현 */}
      <div className={style.box}>
        {isLike ? (
          <div>
            <img className={style.icon} src="/images/jjim.png" alt="jjim" />{" "}
            <p className={style.text}>찜취소</p>
          </div>
        ) : (
          <div>
            <img className={style.icon} src="/images/jjim.png" alt="jjim" />{" "}
            <p className={style.text}>찜하기</p>
          </div>
        )}
      </div>
      <div className={style.box}>
        <img className={style.icon} src="/images/calin.png" alt="calin" />
        <p className={style.text}>일정추가</p>
      </div>
      <div className={style.box}>
        <img className={style.icon} src="/images/star.png" alt="star" />
        <p className={style.text}>리뷰쓰기</p>
      </div>
      <div className={style.box}>
        <img className={style.icon} src="/images/stamp.png" alt="stamp" />
        <p className={style.text}>스탬프</p>
      </div>
    </div>
  );
}
