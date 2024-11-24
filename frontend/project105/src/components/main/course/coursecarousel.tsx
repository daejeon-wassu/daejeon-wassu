"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./coursecarousel.module.css";

interface CarouselProps {
  course:
    | {
        course_name: string;
        description: string;
        image_url: string;
        id: number;
      }[]
    | undefined;
}

export default function CourseCarousel({ course }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  //   console.log(images);
  const router = useRouter();

  //   라우팅 설정합시다. 코스 상세 페이지로 이동해야 합니다.
  const toCourseDetail = (courseId: number) => {
    router.push(`/course/${courseId}`);
  };

  // images가 undefined 또는 빈 배열일 경우 렌더링하지 않도록 처리
  if (!course || course.length === 0) {
    return <div>이미지가 없습니다.</div>;
  }

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? course.length - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === course.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={style.carousel}>
      {/* 이전 버튼 */}
      {course.length > 1 ? (
        <button
          className={`${style.carouselButton} ${style.carouselButtonPrev}`}
          onClick={prevSlide}
        >
          &#10094;
        </button>
      ) : (
        <></>
      )}

      {/* 슬라이드 내용 */}
      <div className={style.carouselContent}>
        <div className={style.shadow}></div>
        <img
          src={course[currentIndex]?.image_url}
          alt="코스 이미지"
          className={style.carouselImage}
          onClick={() => toCourseDetail(course[currentIndex]?.id)}
        />
        <p className={style.p1}>{course[currentIndex]?.course_name}</p>
        <p className={style.p2}>{course[currentIndex]?.description}</p>
      </div>

      {/* 다음 버튼 */}
      {course.length > 1 ? (
        <button
          className={`${style.carouselButton} ${style.carouselButtonNext}`}
          onClick={nextSlide}
        >
          &#10095;
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
