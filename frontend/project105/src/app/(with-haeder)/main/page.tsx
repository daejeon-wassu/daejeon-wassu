"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToLoginModal from "../../../components/main/tologinmodal";
import style from "./page.module.css";
import Reco from "@/components/main/reco/reco";
import Community from "../../../components/main/community/community";
import SearchResultCard from "@/components/main/searchresultcard";
import Course from "@/components/main/course/course";
import { LocationData, UserData } from "@/types";
import axios from "axios";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();

  // 로컬 스토리지에서 토큰 확인 및 유효성 검사
  useEffect(() => {
    document.title = "대전왓슈";
    const token = localStorage.getItem("authToken");
    if (token) {
      const isValidToken = checkTokenValidity(token);
      if (isValidToken) {
        setIsAuthenticated(true);
        getMyData();
      } else {
        setIsAuthenticated(false);
        setIsModalOpen(true);
      }
    } else {
      setIsAuthenticated(false);
      setIsModalOpen(true);
    }
  }, []);

  const checkTokenValidity = (token: string): boolean => {
    return token !== "";
  };

  const goToLogin = () => {
    router.push("/login");
  };

  // 쿼리 스트링 넣을 state
  const [qString, setQSting] = useState("");
  const [searchResult, setSearchResult] = useState<LocationData[]>([]);
  const [word, setWord] = useState("");
  const [forResultPage, setForResultPage] = useState(false);

  const handleWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wordValue = e.target.value;
    setWord(wordValue);
  };

  // 검색 요청하는 axios
  const searchReqest = async () => {
    // 파라미터 값 만들어야 한다.
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/tourist/search`,
        { params: { searchText: word } }
      );
      if (response.data) {
        console.log("검색 결과 조회 성공", response.data.content);
        setQSting(word);
        setForResultPage(true);
        setSearchResult(response.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 유저 데이터 요청 axios
  const [profile, setProfile] = useState<UserData | null>(null);

  const getMyData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("회원정보 조회 성공", response.data);
        setProfile(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter 키가 눌렸습니다!", word);
      router.push(`/main?q=${word}`);
      searchReqest();
    }
  };

  // 메인 페이지
  if (isAuthenticated) {
    return (
      <div className={style.container}>
        <div className={style.main_container}>
          <div className={style.mainbox}>
            <img
              className={style.mainimage}
              src="/images/mainimage.png"
              alt="mainimage"
            />
            <div className={style.maintext}>
              <div className={style.sayhello}>
                안녕하세요, {profile?.nickname} 님
              </div>
              <div className={style.textpromo}>재밌게 즐기세요,</div>
              <div className={style.textpromo}>대전왔슈</div>
            </div>
          </div>
          <div className={style.content_container}>
            <div className={style.deco}></div>

            <div className={style.searchbarcontainer}>
              <img
                className={style.searchicon}
                src="/images/searchicon.png"
                alt=""
              />
              <input
                className={style.searchbar}
                type="text"
                placeholder="대전 관광지를 검색해주세요"
                onChange={handleWord}
                onKeyDown={handleSearch}
              />
            </div>
            {forResultPage ? (
              <div>
                {searchResult.length !== 0 ? (
                  <div className={style.resultcontainer}>
                    <div className={style.resulttitlecontainer}>
                      <div className={style.resulttitle}>
                        <span className={style.qstring1}>
                          &quot;{qString}&quot;
                        </span>
                        과 일치하는 장소
                      </div>
                    </div>
                    <div>
                      {/* 반복문 작성하고 props로 넘겨주면 된다. */}
                      {searchResult.slice(0, 5).map((result) => (
                        <SearchResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={style.resultcontainer}>
                    <div className={style.qstring}>&quot;{qString}&quot;</div>
                    <div className={style.noresult}>검색결과가 없습니다.</div>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            <Reco />
            <div className={style.bar}></div>
            <Course />
            <Community />
          </div>
        </div>
      </div>
    );
  }

  if (isModalOpen) {
    return <ToLoginModal onLoginClick={goToLogin} />;
  }

  // 모달 컴포넌트
  return (
    <div className={style.prom}>
      <svg className={style.loading_container}>
        <rect className={`${style.loading_boxes}`}></rect>
      </svg>
    </div>
  );
}
