"use client";

import style from "./updatedelete.module.css";

export default function UpdateDelete() {
  // 수정페이지로 이동
  // 삭제는 모달 띄우기

  return (
    <div className={style.imgbox}>
      <img className={style.img1} src="/images/update.png" alt="update" />
      <img className={style.img2} src="/images/delete.png" alt="delete" />
    </div>
  );
}
