"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login/loginform";
import ToSignup from "@/components/login/tosignup";
import style from "./page.module.css";

export default function Page() {
  const router = useRouter();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 마운트될 때 토큰 확인
  useEffect(() => {
    document.title = "대전왔슈 - 로그인";
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
      <img className={style.logo} src="/images/logo.png" alt="logo-image" />
      <h1 className={style.title}>대전 왔슈</h1>
      <p className={style.description}>대전의 숨겨진 매력을 찾아 떠나는 여행</p>
      <LoginForm />
      <ToSignup />
    </div>
  );
}
