import React from "react";
import style from "./useapp.module.css";

interface ModalProps {
  onClose: () => void; // 모달을 닫는 함수
}

export default function UseApp({ onClose }: ModalProps) {
  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={style.imgbox}>
          <img className={style.img1} src="/images/logo.png" alt="" />
          <img className={style.img2} src="/images/logotext.png" alt="" />
        </div>
        <div className={style.modalHeader}>
          <h2 className={style.title}>앱을 설치하고 더 다양한</h2>
          <h2 className={style.title}>기능을 사용해 보세요 !</h2>
        </div>
        <div className={style.modalBody}>
          <p className={style.content}>
            앱을 설치하면 일정 추가, 찜하기 등 다양한
          </p>
          <p className={style.content}>기능을 사용하실 수 있습니다!</p>
        </div>
        <div className={style.modalFooter}>
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}
