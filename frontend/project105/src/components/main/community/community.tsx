"use client";
import style from "./community.module.css";
import CommunityCard from "./communitycard";
import CommunityHeader from "./communityheader";
import { ArticleData } from "@/types";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Community() {
  const [articles, setArticles] = useState<ArticleData[]>([]);

  // 비동기 요청을 useEffect로 처리
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `https://k11b105.p.ssafy.io/wassu/posts/filter`
        );
        if (response.data) {
          setArticles(response.data.content);
          console.log();
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  return (
    <div>
      <div className={style.margin_side}>
        <CommunityHeader />
        <p className={style.text}>
          다양한 관광지에 대한 사용자들의 후기를 접하고,
        </p>
        <p className={style.text}>다양한 방법으로 관광지를 즐겨보세요.</p>
      </div>
      <div className={style.containerbox}>
        <div className={style.card_container}>
          {articles.slice(0, 4).map((article) => (
            <CommunityCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}
