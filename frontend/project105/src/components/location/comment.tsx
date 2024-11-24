"use client";

import { ReviewData } from "@/types";
import style from "./comment.module.css";

export default function Comment({
  reviewImages,
  profile,
  content,
}: //   reviewId,
//   content,
//   nickName,
//   profileImage,
//   images,
ReviewData) {
  const image = Array.isArray(reviewImages) ? reviewImages : [];
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
              src={image[0].imageUrl}
              alt="defaultimage"
            />
          </div>
        );
      case 2:
        return (
          <div className={style.imagecontainer2}>
            <img
              className={style.image2}
              src={image[0].imageUrl}
              alt="defaultimage"
            />
            <img
              className={style.image2}
              src={image[1].imageUrl}
              alt="defaultimage"
            />
          </div>
        );
      case 3:
        return (
          <div className={style.image34container}>
            <img
              className={style.image3}
              src={image[0].imageUrl}
              alt="defaultimage"
            />
            <div className={style.image4container}>
              <img
                className={style.image4}
                src={image[1].imageUrl}
                alt="defaultimage"
              />
              <img
                className={style.image4}
                src={image[2].imageUrl}
                alt="defaultimage"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={style.card_container}>
      <div className={style.piccontainer}>{renderImage()}</div>
      {profile.profileImage !== "default" ? (
        <img className={style.profilepic} src={profile.profileImage} alt="" />
      ) : (
        <img className={style.profilepic} src="/images/default.png" alt="" />
      )}

      <div>
        <div className={style.username}>{profile.nickname}</div>
        <div className={style.placedesc}>{content}</div>
      </div>
    </div>
  );
}
