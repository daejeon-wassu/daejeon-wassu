"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseDetailData, CompletedData } from "@/types";
import useDropdownStore from "@/store/dropdownStore";
import style from "./page.module.css";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [forLoading, setForLoading] = useState(false);
  const [courseDetail, setCourseDetail] = useState<CompletedData | undefined>(
    undefined
  );
  const { closeDropdown } = useDropdownStore();

  const toDetail = (bakeryId: string) => {
    router.push(`/location/${bakeryId}`);
  };

  // 코스 상세 조회 axios 요청
  const getCourse = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/fast_api/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        console.log("코스 상세 조회 성공", response.data);
        setCourseDetail(response.data);
        document.title = `대전왔슈-${response.data.course.course_name}`;
        setForLoading(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCourse();
    closeDropdown();
  }, []);

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
        <div className={style.pagetitle}>
          {courseDetail?.course.course_name}
        </div>
        <div className={style.tagbox}></div>
      </div>
      <div className={style.imgbox}>
        <img
          className={style.img}
          src={courseDetail?.course.image_url}
          alt=""
        />
      </div>
      <div className={style.contentbox}>
        <p className={style.content}>{courseDetail?.course.description}</p>
      </div>
      <div className={style.hr}></div>
      <div className={style.introcourse}>
        <p className={style.courseintro}>코스 소개</p>
      </div>
      <div className={style.undercontainer}>
        <div className={style.backbox}>
          <img
            className={style.coursebackground}
            src="/images/coursebackground.png"
            alt=""
          />
        </div>
        <div className={style.cardcontainer}>
          <div className={style.greenline}></div>
          {courseDetail?.course_details.map((item, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? style.leftcardbox : style.rightcardbox
              }`}
            >
              <div className={style.rowline}></div>
              <div
                className={style.card}
                onClick={() => toDetail(item.elastic_id)}
              >
                <div className={style.cardheader}>
                  <div className={style.cardnumber}>{index + 1}</div>
                  <div className={style.cardtitle}>{item.bakery_name}</div>
                </div>
                <div>
                  {item.spot_image_url ? (
                    <img
                      className={style.cardimg}
                      src={item.spot_image_url}
                      alt="장소 image"
                    />
                  ) : (
                    <img
                      className={style.cardimg}
                      src="/images/default.png"
                      alt=""
                    />
                  )}
                </div>
                <div className={style.bottombox}>
                  <div className={style.boxboxbox}>
                    {/* <div className={style.cardtagbox}>
                      <div className={style.cardtag}>#문화</div>
                      <div className={style.cardtag}>#인기</div>
                    </div> */}
                    <div className={style.cardcontent2}>{item.description}</div>
                    <div className={style.cardcontent}>{item.address}</div>
                  </div>
                  <div className={style.monsterbox}>
                    <div className={style.wassudesc}>
                      출몰 <span className={style.gtext}>왓슈몬</span>
                    </div>
                    <img
                      className={style.wassu}
                      src={item.wassumon_image_url}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
