"use client";

import { useState } from "react";
import style from "./page.module.css";
import PartOne from "@/components/mypage/partone";
import PartTwo from "@/components/mypage/parttwo";
import PartThree from "@/components/mypage/partthree";

export default function Page() {
  const [activeButton, setActiveButton] = useState<number | null>(1);

  // 버튼 클릭 시 활성화 상태 변경
  const handleButtonClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber);
  };

  const renderImage1 = () => {
    switch (activeButton) {
      case 1:
        return (
          <div className={style.img1}>
            <PartOne />
          </div>
        );
      case 2:
        return (
          <div className={style.img1}>
            <PartTwo />
          </div>
        );
      case 3:
        return (
          <div className={style.img1}>
            <PartThree />
          </div>
        );
      case 4:
        return <div className={style.img1}>이미지 4</div>;
      default:
        return <div className={style.img1}>기본 이미지</div>; // 기본 이미지
    }
  };

  return (
    <div>
      <div className={style.navbox}>
        <button
          className={`${style.nav} ${activeButton === 1 ? style.active : ""}`}
          onClick={() => handleButtonClick(1)}
        >
          나의 여행
        </button>
        <button
          className={`${style.nav} ${activeButton === 2 ? style.active : ""}`}
          onClick={() => handleButtonClick(2)}
        >
          나의 기록
        </button>
        <button
          className={`${style.nav} ${activeButton === 3 ? style.active : ""}`}
          onClick={() => handleButtonClick(3)}
        >
          여행기
        </button>
      </div>
      <div>{renderImage1()}</div>
    </div>
  );
}
