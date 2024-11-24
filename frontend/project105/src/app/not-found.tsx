"use client";

import { useRouter } from "next/navigation";
import style from "./not-found.module.css";

export default function NotFoundPage() {
  const router = useRouter();

  const toRanding = () => {
    router.push("/");
  };

  return (
    <div className={style.container}>
      <div>
        <div className={style.logobox}>
          <img className={style.logo} src="/images/logo.png" alt="" />
          <img className={style.logotext} src="/images/logotext.png" alt="" />
        </div>
        <p className={style.text}>페이지를 찾을 수 없습니다.</p>
        <p className={style.text2}>
          요청하신 주소에 대한 페이지를 찾을 수 없습니다.
        </p>
        <div className={style.buttonbox}>
          <button className={style.button} onClick={toRanding}>
            이용하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
