"use client";

import { useState } from "react";
import style from "./sectiontowpart.module.css";

export default function SectionTwoPart() {
  const [activeButton, setActiveButton] = useState<number | null>(1);

  // 버튼 클릭 시 활성화 상태 변경
  const handleButtonClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber);
  };
  // <img src="/images/검색1.png" alt="" />;
  const renderImage1 = () => {
    switch (activeButton) {
      case 1:
        return (
          <div className={style.img1}>
            <img
              className={style.img11}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/검색1.PNG"
              alt=""
            />
          </div>
        ); // 버튼 1 클릭 시 보여줄 이미지  https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/관광지추천.PNG
      case 2:
        return (
          <div className={style.img11111}>
            <img
              className={style.img111111}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/관광지추천.PNG"
              alt=""
            />
          </div>
        ); // 버튼 2 클릭 시 보여줄 이미지
      case 3:
        return (
          <div className={style.img111}>
            <img className={style.img11} src="/images/랜드마크.png" alt="" />
          </div>
        ); // 버튼 3 클릭 시 보여줄 이미지
      case 4:
        return (
          <div className={style.img1}>
            <img
              className={style.img11}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/상세2.PNG"
              alt=""
            />
          </div>
        ); // 버튼 4 클릭 시 보여줄 이미지
      default:
        return <div className={style.img1}>기본 이미지</div>;
    }
  };

  const renderImage2 = () => {
    switch (activeButton) {
      case 1:
        return (
          <div className={style.img2}>
            <img
              className={style.img11}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/검색.PNG"
              alt=""
            />
          </div>
        ); // 버튼 1 클릭 시 보여줄 이미지
      case 2:
        return <div></div>; // 버튼 2 클릭 시 보여줄 이미지
      case 3:
        return (
          <div className={style.img2}>
            <img
              className={style.img11}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/도장랜딩.PNG"
              alt=""
            />
          </div>
        ); // 버튼 3 클릭 시 보여줄 이미지
      case 4:
        return (
          <div className={style.img2}>
            <img
              className={style.img11}
              src="https://wassu-k11b105.s3.ap-northeast-2.amazonaws.com/landing_page/상세1.PNG"
              alt=""
            />
          </div>
        ); // 버튼 4 클릭 시 보여줄 이미지
      default:
        return <div className={style.img2}>기본 이미지</div>; // 기본 이미지
    }
  };

  return (
    <div className={style.container}>
      <div>
        <p className={style.text1}>대전을 맛있고, 즐겁게 !</p>
        <p className={style.text2}>대전 광광 명소를 검색하고,</p>
        <p className={style.text3}>
          각 지역에 스탬프를 찍고 경험치를 쌓아보세요
        </p>
        <div className={style.buttoncontainer}>
          <p
            className={`${style.buttontext} ${
              activeButton === 1 ? style.active : ""
            }`}
            onClick={() => handleButtonClick(1)}
          >
            1. 대전 관광지 검색
          </p>
          <p
            className={`${style.buttontext} ${
              activeButton === 2 ? style.active : ""
            }`}
            onClick={() => handleButtonClick(2)}
          >
            2. 관광지 추천
          </p>
        </div>
        <div className={style.buttoncontainer}>
          <p
            className={`${style.buttontext} ${
              activeButton === 3 ? style.active : ""
            }`}
            onClick={() => handleButtonClick(3)}
          >
            3. 스탬프
          </p>
          <p
            className={`${style.buttontext} ${
              activeButton === 4 ? style.active : ""
            }`}
            onClick={() => handleButtonClick(4)}
          >
            4. 관광지 상세
          </p>
        </div>
        <div>
          <button className={style.searchbutton}>장소 검색하기</button>
        </div>
      </div>
      <div className={style.imgbox}>
        {renderImage1()}
        {renderImage2()}
      </div>
    </div>
  );
}
