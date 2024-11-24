"use client";

import { useRouter } from "next/navigation";
import { UserData } from "@/types";
import { useEffect, useState } from "react";
import useDropdownStore from "@/store/dropdownStore";
import axios from "axios";
import style from "./header.module.css";

export default function Header() {
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useDropdownStore();

  const [forRand, setForRand] = useState(false);

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
        setForRand(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 로그아웃 요청 axios
  const logout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/auth/logout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("로그아웃 성공", response.data);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();

  const toMain = () => {
    closeDropdown();
    router.push("/main");
  };

  const toMyPage = () => {
    closeDropdown();
    router.push("/mypage");
  };

  useEffect(() => {
    getMyData();
  }, []);

  return (
    <div className={style.header}>
      <img
        className={style.logotext}
        src="/images/logotext.png"
        alt="logotext"
        onClick={toMain}
      />

      {forRand ? (
        <div className={style.profile} onClick={toggleDropdown}>
          <img
            className={style.img}
            src={profile?.profileImage}
            alt="profileimg"
          />
          {isDropdownOpen && (
            <div className={style.dropdownMenu}>
              <button className={style.dropdownItem} onClick={toMyPage}>
                마이페이지
              </button>
              <button className={style.dropdownItemr} onClick={logout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
