import React from "react";
import style from "./tologinmodal.module.css";

interface LoginModalProps {
  onLoginClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginClick }) => {
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <div className={style.imgbox}>
          <img className={style.img1} src="images/logo.png" alt="" />
          <img className={style.img2} src="/images/logotext.png" alt="" />
        </div>
        <h1 className={style.h1}>로그인을 안하셨네요 !</h1>
        <p className={style.content}>
          로그인인 하고, 다양한 기능을 사용해보세요
        </p>
        <button className={style.button} onClick={onLoginClick}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
