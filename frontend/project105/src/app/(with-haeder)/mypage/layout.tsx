"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { UserData } from "@/types";
import { useRouter } from "next/navigation";
import useDropdownStore from "@/store/dropdownStore";
import axios from "axios";
import style from "./layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { closeDropdown } = useDropdownStore();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 파일 선택 상태 및 미리보기 URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  // 회원탈퇴 요청 axios
  const deleteAccount = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `https://k11b105.p.ssafy.io/wassu/auth/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("회원탈퇴 성공", response.data);
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
        document.title = `대전왓슈 - ${response.data.nickname}`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyData();
    closeDropdown();
  }, []);

  // 파일 선택 이벤트 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 업데이트
  const updateProfileImage = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.put(
        `https://k11b105.p.ssafy.io/wassu/user/profile/edit/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        console.log("프로필 이미지 업데이트 성공", response.data);
        setProfile((prevProfile) =>
          prevProfile
            ? { ...prevProfile, profileImage: response.data.imageUrl }
            : null
        );
        alert("프로필 이미지가 업데이트되었습니다.");
        setIsModalOpen(false); // 모달 닫기
        setPreviewUrl(null); // 미리보기 URL 초기화
        getMyData();
      }
    } catch (error) {
      console.error("프로필 이미지 업데이트 실패", error);
      alert("프로필 이미지 업데이트에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.profilebox}>
          <div className={style.foralign}>
            <img
              className={style.profileimg}
              src={profile?.profileImage}
              alt=""
              onClick={() => setIsModalOpen(true)} // 모달 열기
            />
            <div>
              <p className={style.nickname}>
                {profile?.nickname} &nbsp;&nbsp;
                <span className={style.level}>{profile?.level}</span>
              </p>
              <p className={style.email}>{profile?.email}</p>
            </div>
          </div>
          <div className={style.buttons}>
            <button className={style.logoutbutton} onClick={logout}>
              로그아웃
            </button>
            <button className={style.outbutton} onClick={deleteAccount}>
              회원탈퇴
            </button>
          </div>
        </div>
        <div className={style.hr}></div>
        <div className={style.main_container}>{children}</div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className={style.modaltitle}>프로필 이미지 수정</h2>
            <div className={style.imgcontain}>
              {previewUrl ? (
                <div className={style.previewContainer}>
                  {/* <p>이미지 미리보기:</p> */}
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className={style.previewImage}
                  />
                </div>
              ) : (
                <div
                  className={style.altimg}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  +
                </div>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className={style.modalButtons}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPreviewUrl(null); // 미리보기 URL 초기화
                }}
              >
                취소
              </button>
              <button onClick={updateProfileImage}>완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
