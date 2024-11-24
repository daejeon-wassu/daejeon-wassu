import { useState } from "react";
import styles from "./carousel.module.css"; // CSS 파일 임포트

interface CarouselProps {
  images: { url: string; alt: string }[] | undefined;
  // undefined 허용
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(images);

  // images가 undefined 또는 빈 배열일 경우 렌더링하지 않도록 처리
  if (!images || images.length === 0) {
    return <div className={styles.noimg}>&quot; 이미지가 없어요 😢 &quot;</div>;
  }

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.carousel}>
      {/* 이전 버튼 */}
      {/* 조건 처리 해야한다 */}
      {images.length > 1 ? (
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonPrev}`}
          onClick={prevSlide}
        >
          &#10094; {/* 왼쪽 화살표 */}
        </button>
      ) : (
        <></>
      )}

      {/* 슬라이드 내용 */}
      <div className={styles.carouselContent}>
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className={styles.carouselImage}
        />
      </div>

      {/* 다음 버튼 */}
      {/* 조건 처리 해야한다 */}
      {images.length > 1 ? (
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
          onClick={nextSlide}
        >
          &#10095; {/* 오른쪽 화살표 */}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
