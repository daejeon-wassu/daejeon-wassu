"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LocationData } from "@/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useDropdownStore from "@/store/dropdownStore";
import axios from "axios";
import style from "./page.module.css";
import Comment from "@/components/location/comment";
import UseApp from "@/components/useapp";
import Carousel from "@/components/location/carousel";
import useKakaoLoader from "@/components/kakao/kakaomap";

export default function Page() {
  useKakaoLoader();
  const { id } = useParams();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forLoading, setForLoading] = useState(false);
  const { closeDropdown } = useDropdownStore();

  const [number, setNumber] = useState(4);
  const plusNumber = () => {
    setNumber(number + 4);
  };

  // 장소 디테일 호출 axios 함수
  const getDetail = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/tourist/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("장소 상세 조회 성공", response.data);
        setLocation(response.data);
        setForLoading(true);
        document.title = `대전왓슈 - ${response.data.spotName}`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 장소 찜하기 axios 요청
  const jjimLoca = async () => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/tourist/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("찜하기 성공", response.data);
        getDetail();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 장소 찜하기 취소 axios 요청
  const unJjimLoca = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `https://k11b105.p.ssafy.io/wassu/tourist/${id}/favorite`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("찜 취소하기 성공", response.data);
        getDetail();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDetail();
    closeDropdown();
  }, []);

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 로딩중일 때
  if (!forLoading) {
    return (
      <div className={style.prom}>
        <svg className={style.loading_container}>
          <rect className={`${style.loading_boxes}`}></rect>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className={style.header}>
        <div className={style.title}>{location?.spotName}</div>
        <div className={style.iconbox}>
          <img className={style.icon} src="/images/pencil.png" alt="" />
          <div className={style.icontext}>{location?.reviewCount}</div>
          <img className={style.icon} src="/images/heart.png" alt="" />
          <div className={style.icontext}>{location?.favoritesCount}</div>
        </div>
        <div className={style.locationbox}>
          <img
            className={style.locationicon}
            src="/images/location.png"
            alt=""
          />

          <div className={style.location}>{location?.spotAddress}</div>
        </div>
      </div>
      <div>
        <Carousel touristSpotImages={location?.touristSpotImages} />
      </div>
      <div>
        <div className={style.container1}>
          <div className={style.box1}>
            {location?.favorite ? (
              <div onClick={unJjimLoca}>
                <img
                  className={style.icon1}
                  src="/images/jjimed.png"
                  alt="jjim"
                />
                <p className={style.text1}>찜취소</p>
              </div>
            ) : (
              <div onClick={jjimLoca}>
                <img
                  className={style.icon1}
                  src="/images/jjim.png"
                  alt="jjim"
                />
                <p className={style.text1}>찜하기</p>
              </div>
            )}
          </div>
          <div className={style.box1}>
            <img
              className={style.icon1}
              src="/images/calin.png"
              alt="calin"
              onClick={openModal}
            />
            <p className={style.text1}>일정추가</p>
          </div>
          <div className={style.box1} onClick={openModal}>
            <img className={style.icon1} src="/images/star.png" alt="star" />
            <p className={style.text1}>리뷰쓰기</p>
          </div>
          <div className={style.box1}>
            {location?.stamped ? (
              <img
                className={style.icon1}
                src="/images/dojang.png"
                alt="stamp"
              />
            ) : (
              <img
                className={style.icon1}
                src="/images/stamp.png"
                alt="stamp"
              />
            )}

            <p className={style.text1}>스탬프</p>
          </div>
        </div>
      </div>
      <div className={style.br}></div>

      {isModalOpen && <UseApp onClose={closeModal} />}

      <div>
        <div className={style.ssss}>
          <div className={style.detailcontainer}>
            <div className={style.detailtext}>상세정보</div>
            <div>
              <div className={style.catetitle}>
                <img
                  className={style.cateicon}
                  src="/images/clock.png"
                  alt=""
                />
                <p className={style.catetext}>영업시간</p>
              </div>
              <div className={style.catedesc}>
                {location?.businessHours !== "정보 없음" ? (
                  <div>
                    {" "}
                    {location?.businessHours.split("|").map((day, index) => (
                      <p key={index} className={style.catedesctext}>
                        {day}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className={style.catedesctext}>정보 없음</div>
                )}
              </div>
            </div>
            <div>
              <div className={style.catetitle}>
                <img className={style.cateicon} src="/images/tele.png" alt="" />
                <p className={style.catetext}>전화번호</p>
              </div>
              <div className={style.catedesc}>
                {location?.phone !== "정보 없음" ? (
                  <p className={style.catedesctext}>{location?.phone}</p>
                ) : (
                  <p className={style.catedesctext}>정보 없음</p>
                )}
              </div>
            </div>
            <div>
              <div className={style.catetitle}>
                <img className={style.cateicon} src="/images/loca.png" alt="" />
                <p className={style.catetext}>위치</p>
              </div>
              <div className={style.catedesc}>
                <p className={style.catedesctext}>{location?.spotAddress}</p>
                {location?.latitude !== undefined &&
                  location?.longitude !== undefined && (
                    <Map
                      id="map"
                      center={{
                        lat: location.latitude,
                        lng: location.longitude,
                      }}
                      style={{
                        width: "95%",
                        height: "280px",
                        borderRadius: "20px",
                        marginTop: "15px",
                      }}
                      level={3}
                    >
                      <MapMarker
                        position={{
                          lat: location.latitude,
                          lng: location.longitude,
                        }}
                        image={{
                          src: "/images/marker.png",
                          size: {
                            width: 55,
                            height: 40,
                          },
                          options: {
                            offset: {
                              x: 18,
                              y: 36,
                            },
                          },
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "180px",
                            height: "10px",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-1px",
                              top: "-1px",

                              width: "200px",
                              height: "35px",
                              borderRadius: "3px",
                              padding: "3px 5px",
                              color: "#418663",
                              textAlign: "center",
                              background: "none",
                              backgroundColor: "#ffffff",
                              border: "2px solid #418663",
                              fontSize: "13px",
                              lineHeight: "25px",
                            }}
                          >
                            {location?.spotName}
                          </div>
                        </div>
                      </MapMarker>
                    </Map>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.maindesccontainer}>
        <div>
          <div className={style.detailtext}>설명</div>
        </div>
        <p className={style.catedesctext1}>{location?.spotDescription}</p>
      </div>
      <div>
        <div className={style.ssss}>
          <div className={style.detailcontainer}>
            <div>
              <div className={style.detailtext}>방문후기</div>
            </div>

            <div className={style.commentcontainer}>
              {/* 만약 방문후기가 없으면 없습니다. 있으면 아래 띄우면 된다. */}

              <div className={style.commentcardbox}>
                {location?.reviews.slice(0, number).map((review, index) => (
                  <Comment key={review.reviewId} {...review} />
                ))}
              </div>

              {location?.reviewCount === 0 ? (
                <div className={style.noreview}>
                  <span className={style.noreviewtext}>방문후기</span>가
                  없습니다
                </div>
              ) : (
                <button className={style.more} onClick={plusNumber}>
                  더보기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
