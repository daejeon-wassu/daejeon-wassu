"use client";

import { useRouter } from "next/navigation";
import style from "./tosignup.module.css";

export default function ToSignup() {
  const router = useRouter();

  const onClickButton = () => {
    router.push("/signup");
  };

  return (
    <button onClick={onClickButton} className={style.button_st}>
      회원가입
    </button>
  );
}
