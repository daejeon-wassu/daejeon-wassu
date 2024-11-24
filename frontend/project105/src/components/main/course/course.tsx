import { useEffect, useState } from "react";
import { CourseData } from "@/types";
import style from "./course.module.css";
import axios from "axios";
// import CourseCarousel from "./coursecarousel"
// import Carousel from "./coursecarousel";
// import Carousel from "./carousel";
import CourseCarousel from "./coursecarousel";

export default function Course() {
  // 코스 데이터 상태
  const [course, setCourse] = useState<CourseData[]>([]);

  // 추천코스들 요청하는 axios
  const coursesRequest = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/fast_api/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("추천코스들 요청 성공", response.data);
        setCourse(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    coursesRequest();
  }, []);

  // const images = ["1", "2", "3", "4"];

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>
          <p className={style.text1}>
            <span className={style.gtext}>대전왓슈</span> 제공
          </p>
          <p className={style.text2}>대전 여행 코스 추천 👍</p>
        </div>
        <div className={style.desc}>
          대전 인기 관광지를 기반으로 코스를 추천합니다
        </div>
      </div>
      <div className={style.carousel}>
        {/* <div>캐러셀 들어가자</div> */}
        <CourseCarousel course={course} />
      </div>
    </div>
  );
}
