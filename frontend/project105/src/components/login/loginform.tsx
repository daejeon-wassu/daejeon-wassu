"use client";

import { useState } from "react";
import style from "./loginform.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  // 회원정보 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 회원정보 변경 함수
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
  };

  // 로그인 요청
  const loginRequest = async () => {
    const userData = { email: email, password: password };
    try {
      const response = await axios.post(
        "https://k11b105.p.ssafy.io/wassu/auth/login",
        userData
      );
      if (response.data) {
        console.log("로그인 성공", response.data);
        localStorage.setItem("authToken", response.data.access);
        router.push("/main");
      }
    } catch (error) {
      console.error("인증 요청 실패:", error);
      alert("이메일 혹은, 비밀번호를 잘못 입력했습니다.");
    }
  };

  // 엔터키 로그인
  const loginEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter 키가 눌렸습니다!");
      loginRequest();
    }
  };

  return (
    <div className={style.container}>
      <label className={style.label_st} htmlFor="useremail">
        이메일
      </label>
      <input
        className={style.input_box}
        type="email"
        id="useremail"
        name="useremail"
        placeholder="이메일"
        onChange={onChangeEmail}
      />
      <label className={style.label_st} htmlFor="password">
        비밀번호
      </label>
      <input
        className={style.input_box}
        type="password"
        id="password"
        name="password"
        placeholder="비밀번호"
        onChange={onChangePassword}
        onKeyDown={loginEnter}
      />
      <button className={style.button_st} onClick={loginRequest}>
        로그인
      </button>
    </div>
  );
}
