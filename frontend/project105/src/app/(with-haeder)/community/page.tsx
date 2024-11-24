"use client";

import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import CommunityCard from "@/components/main/community/communitycard";
import style from "./page.module.css";
import useDropdownStore from "@/store/dropdownStore";

export default function Page() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const { closeDropdown } = useDropdownStore();

  const getArticles = async () => {
    // const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/filter`,
        { params: { size: 100 } }
      );
      if (response.data) {
        console.log("게시글 전체 조회 성공", response.data.content);
        setArticles(response.data.content.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toCreate = () => {
    router.push("/community/create");
  };

  useEffect(() => {
    document.title = "대전왓슈-커뮤니티";
    getArticles();
    closeDropdown();
  }, []);

  return (
    <div className={style.backgroundcolor}>
      <div className={style.header}>
        <div className={style.title}>
          <div className={style.titletext1}>다양한 관광지에 대한 소감,</div>
          <div className={style.titletext2}>커뮤니티 ‍🤝‍🧑</div>
        </div>
        <div className={style.writebox}>
          <div>
            <p className={style.content}>
              다양한 관광지에 대한 사용자들의 후기를 접하고,
            </p>
            <p className={style.content}>
              다양한 방법으로 관광지를 즐겨보세요.
            </p>
          </div>
          <img
            className={style.writebutton}
            src="/images/update.png"
            alt=""
            onClick={toCreate}
          />
        </div>
      </div>
      <div className={style.containerbox}>
        <div className={style.cardcontainer}>
          {articles.length > 0 ? (
            articles
              .slice()
              .reverse()
              .map((article) => <CommunityCard key={article.id} {...article} />)
          ) : (
            <div>게시글을 불러오는 중입니다...</div>
          )}
        </div>
      </div>
    </div>
  );
}
