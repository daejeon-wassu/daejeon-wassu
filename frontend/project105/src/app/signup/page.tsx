"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import SignupForm from "../../components/signup/signupform";

export default function Page() {
  const router = useRouter();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 마운트될 때 토큰 확인
  useEffect(() => {
    document.title = "대전왓슈 - 회원가입";
    const token = localStorage.getItem("authToken");

    // 토큰이 있으면 main 페이지로 리디렉션
    if (token) {
      router.push("/main");
    } else {
      // 토큰이 없으면 로딩 끝내기
      setIsLoading(false);
    }
  }, [router]);

  // 로딩 중일 때
  if (isLoading) {
    return <></>;
  }
  return (
    <div className={style.container}>
      <div className={style.logo_container}>
        <img className={style.logotext} src="/images/logotext.png" alt="" />
        <p className={style.logo_description}>
          대전의 숨겨진 매력을 찾아 떠나는 여행
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
