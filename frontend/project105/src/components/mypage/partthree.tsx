"use client";

import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import { useRouter } from "next/navigation";
import style from "./partthree.module.css";
import axios from "axios";

export default function PartThree() {
  const router = useRouter();

  // 내가 작성한 게시글
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const getMyArticle = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/user/article`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("내 게시글 조회 성공", response.data);
        setArticles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toDetail = (id: string) => {
    router.push(`/community/${id}`);
  };

  const toCreate = () => {
    router.push(`/community/create`);
  };

  useEffect(() => {
    getMyArticle();
  }, []);

  return (
    <div>
      {/* <h2>내가 작성한 게시글</h2> */}
      {/* 조건부 렌더링 */}

      {articles.length > 0 ? (
        <div className={style.cardbox}>
          {articles.map((item, index) => (
            <div
              onClick={() => toDetail(item.id)}
              className={style.card}
              key={index}
            >
              {item.images.length > 0 ? (
                <img
                  className={style.postimg}
                  src={item.images[0].url}
                  alt=""
                />
              ) : (
                <div className={style.noimg}>{item.content}</div>
              )}
              <div className={style.cardtitle}>{item.title}</div>
              <div className={style.datebox}>
                <div className={style.carddate}>
                  {item.createdAt.slice(0, 10)}
                </div>
                <img className={style.icon} src="/images/jjim.png" alt="" />
                <div className={style.likenumber}>{item.liked}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.noarticle}>
          <p className={style.information}>작성한 게시글이 없습니다</p>
          <p className={style.buttondesc}>
            게시글을 작성하고 자신의 경험을 공유해보세요 !
          </p>
          <button className={style.createbutton} onClick={toCreate}>
            게시글 작성하기
          </button>
        </div>
      )}
    </div>
  );
}
