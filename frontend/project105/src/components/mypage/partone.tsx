"use client";

import { useEffect, useState } from "react";
import { MyScheduleData } from "@/types";
import UseApp from "../useapp";
import axios from "axios";
import style from "./partone.module.css";

export default function PartOne() {
  const [mySchedule, setMySchedule] = useState<MyScheduleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 내 여행 조회
  const getMyTrip = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/courses/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("내 여행 일정 조회", response.data);
        setMySchedule(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyTrip();
  }, []);

  return (
    <div className={style.partonebox}>
      <div className={style.addschebox}>
        {isModalOpen && <UseApp onClose={closeModal} />}
        <button className={style.addbutton} onClick={openModal}>
          +
        </button>
        <div className={style.contentbox}>
          <p className={style.text1}>대전 여행 일정 추가하기</p>
          <p className={style.text2}>대전왔슈와 대전 여행을 함께하세요</p>
        </div>
      </div>

      <div className={style.schedulesbox}>
        <p className={style.boxtitle}>진행중인 일정</p>

        {mySchedule?.onGoingSchedules ? (
          <div className={style.cardcontainer}>
            <div className={style.card}>
              <p className={style.cardtitle}>
                {mySchedule?.onGoingSchedules.title}
              </p>
              <p className={style.carddate}>
                시작일 : {mySchedule?.onGoingSchedules.startDate}
              </p>
              <img
                className={style.cardimg}
                src={mySchedule?.onGoingSchedules.thumbnail}
                alt=""
              />
              <p className={style.locacount}>
                {mySchedule?.onGoingSchedules.spotCount}개 관광지
              </p>
            </div>
          </div>
        ) : (
          <div className={style.cardcontainer2}>진행중인 일정이 없습니다</div>
        )}
      </div>

      <div className={style.schedulesbox}>
        <p className={style.boxtitle}>다가오는 일정</p>

        {mySchedule?.upcomingSchedules &&
        mySchedule?.upcomingSchedules.length !== 0 ? (
          <div className={style.cardcontainer}>
            {mySchedule?.upcomingSchedules.map((item, index) => (
              <div key={index}>
                <div className={style.card}>
                  <p className={style.cardtitle}>{item.title}</p>
                  <p className={style.carddate}>시작일 : {item.startDate}</p>
                  <img className={style.cardimg} src={item.thumbnail} alt="" />
                  <p className={style.locacount}>{item.spotCount}개 관광지</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.cardcontainer2}>다가오는 일정이 없습니다</div>
        )}
      </div>
      <div className={style.schedulesbox}>
        <p className={style.boxtitle}>지난 일정</p>
        {mySchedule?.upcomingSchedules &&
        mySchedule?.pastSchedules.length !== 0 ? (
          <div className={style.cardcontainer}>
            {mySchedule?.pastSchedules.map((item, index) => (
              <div key={index}>
                <div className={style.card}>
                  <p className={style.cardtitle}>{item.title}</p>
                  <p className={style.carddate}>종료일 : {item.endDate}</p>
                  <img className={style.cardimg} src={item.thumbnail} alt="" />
                  <p className={style.locacount}>{item.spotCount}개 관광지</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.cardcontainer2}>지난 일정이 없습니다</div>
        )}
      </div>

      <div></div>
    </div>
  );
}
