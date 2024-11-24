"use client";

import { useRouter } from "next/navigation";
import style from "./tocommunity.module.css";

export default function ToCommunity() {
  const router = useRouter();

  const toCommunityButton = () => {
    router.push("/community");
  };

  return (
    <div className={style.text} onClick={toCommunityButton}>
      커뮤니티 바로가기 &gt;
    </div>
  );
}
