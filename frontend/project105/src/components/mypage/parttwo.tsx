"use client";

import { useEffect, useState } from "react";
import { StampData, ChallengeData } from "@/types";
import style from "./parttwo.module.css";
import axios from "axios";

export default function PartTwo() {
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData | null>(null);

  // 스탬프 조회
  const getStamp = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/tourist/stamp/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("스탬프 조회 성공", response.data);
        setStamps(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getChallenge = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/fast_api/user/challenges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("챌린지 조회 성공", response.data);
        setChallenges(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 챌린지 조회
  useEffect(() => {
    getStamp();
    getChallenge();
  }, []);

  return (
    <div>
      <div className={style.container}>
        <div className={style.stampbox}>
          <h3 className={style.stamptitle}>도장</h3>
        </div>

        <div className={style.challengebox}>
          <div className={style.stampcardbox}>
            {/* stamps 배열이 비어 있을 때 처리 */}
            {stamps.length === 0 ? (
              <p className={style.nono}>스탬프가 없습니다</p>
            ) : (
              stamps.map((item, index) => (
                <div key={index} className={style.stampcard}>
                  <img
                    className={style.stampimg}
                    src={`images/${item.category}.png`}
                    alt="도장사진"
                  />
                  <div className={style.cardtitle}>{item.spotName}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div></div>
      </div>

      {/* 챌린지 */}
      <div className={style.challengecontainer}>
        <h1 className={style.chaltitle}>
          <span className={style.g}>진행중인</span> 챌린지
        </h1>
        {/* challenges가 없거나 비어 있을 때 처리 */}
        {challenges?.in_progress?.length === 0 ? (
          <p className={style.nono}>진행중인 챌린지가 없습니다</p>
        ) : (
          challenges?.in_progress?.map((item, index) => (
            <div key={index} className={style.chalcard}>
              <img
                className={style.chalimg}
                src={item.course.image_url}
                alt=""
              />
              <div className={style.chalcontentbox}>
                <div>
                  <div className={style.coursename}>
                    {item.course.course_name}
                  </div>
                  <div className={style.coursedesc}>
                    {item.course.description}
                  </div>
                </div>
                <div>
                  <span className={style.done1}>{item.completed_count}</span>
                  <span className={style.done}>&nbsp; /&nbsp; </span>
                  <span className={style.done}>
                    {item.course_details.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        <h1 className={style.chaltitle}>
          <span className={style.g}>완료한</span> 챌린지
        </h1>
        {/* challenges.completed가 없거나 비어 있을 때 처리 */}
        {challenges?.completed?.length === 0 ? (
          <p className={style.nono}>완료한 챌린지가 없습니다</p>
        ) : (
          challenges?.completed?.map((item, index) => (
            <div key={index} className={style.chalcard}>
              <img
                className={style.chalimg}
                src={item.course.image_url}
                alt=""
              />
              <div className={style.chalcontentbox}>
                <div>
                  <div className={style.coursename}>
                    {item.course.course_name}
                  </div>
                  <div className={style.coursedesc}>
                    {item.course.description}
                  </div>
                </div>
                <div>
                  <span className={style.done1}>{item.completed_count}</span>
                  <span className={style.done}>&nbsp; /&nbsp; </span>
                  <span className={style.done}>
                    {item.course_details.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
