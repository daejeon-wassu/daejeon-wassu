"use client";

import { useRouter } from "next/navigation";
import style from "./buttons.module.css";

export default function Buttons() {
  const router = useRouter();

  const toLogin = () => {
    router.push("./login");
  };

  const toSignup = () => {
    router.push("./signup");
  };

  return (
    <div className={style.buttonbox}>
      <button className={style.login} onClick={toLogin}>
        로그인
      </button>
      <button className={style.signup} onClick={toSignup}>
        회원가입
      </button>
    </div>
  );
}
