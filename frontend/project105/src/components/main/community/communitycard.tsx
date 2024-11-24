"use client";

import { ArticleData } from "@/types";
import style from "./communitycard.module.css";
import { useRouter } from "next/navigation";

export default function CommunityCard({
  id,
  title,
  content,
  nickName,
  profileImage,
  images,
}: ArticleData) {
  // 일단 여기는 props로 이미 데이터를 받은 상태이다.
  const router = useRouter();
  const toDetail = () => {
    router.push(`/community/${id}`);
  };

  const image = Array.isArray(images) ? images : [];
  const renderImage = () => {
    switch (image.length) {
      case 0:
        return (
          <div>
            <img
              className={style.defaultimage}
              src="/images/default.png"
              alt="defaultimage"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <img
              className={style.defaultimage}
              src={image[0].url}
              alt="defaultimage"
            />
          </div>
        );
      case 2:
        return (
          <div className={style.imagecontainer2}>
            <img
              className={style.image2}
              src={image[0].url}
              alt="defaultimage"
            />
            <img
              className={style.image2}
              src={image[1].url}
              alt="defaultimage"
            />
          </div>
        );
      case 3:
        return (
          <div className={style.image34container}>
            <img
              className={style.image3}
              src={image[0].url}
              alt="defaultimage"
            />
            <div className={style.image4container}>
              <img
                className={style.image4}
                src={image[1].url}
                alt="defaultimage"
              />
              <img
                className={style.image4}
                src={image[2].url}
                alt="defaultimage"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={style.card_container} onClick={toDetail}>
      <div className={style.piccontainer}>{renderImage()}</div>
      {/* <div >프사</div> */}
      {profileImage !== "default" ? (
        <img className={style.profilepic} src={profileImage} alt="" />
      ) : (
        <img className={style.profilepic} src="/images/default.png" alt="" />
      )}

      <div>
        <div className={style.username}>{nickName}</div>
        <div className={style.placename}>{title}</div>
        <div className={style.placedesc}>{content}</div>
      </div>
    </div>
  );
}
