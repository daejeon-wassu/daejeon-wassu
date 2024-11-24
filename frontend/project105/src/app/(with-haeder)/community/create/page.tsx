"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import axios from "axios";
import useDropdownStore from "@/store/dropdownStore";

interface ArticleDTO {
  title: string;
  content: string;
  tags: string[];
}

export default function Page() {
  const router = useRouter();
  const { closeDropdown } = useDropdownStore();

  // 제목 상태 관리
  const [title, setTitle] = useState<string>("");
  // 내용 상태 관리
  const [content, setContent] = useState<string>("");
  // 카테고리 상태 관리
  const [categories, setCategories] = useState<string[]>([]);
  // 이미지 리스트 상태 관리
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 미리보기 이미지 URL을 저장할 상태

  // 제목 핸들러
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 핸들러
  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 카테고리 핸들러
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories([e.target.value]);
  };

  // 이미지 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files) {
      const file = fileInput.files[0];
      if (file) {
        setImages((prevImages) => [...prevImages, file]);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviews((prevPreviews) => [
              ...prevPreviews,
              reader.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (index: number) => {
    // 이미지 삭제
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // 미리보기 삭제
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const [token, setToken] = useState("");

  // 게시글 폼 제출 핸들러
  const submit = async () => {
    // const token = localStorage.getItem("authToken");
    const formData = new FormData();
    const articleDTO: ArticleDTO = {
      title: title,
      content: content,
      tags: categories,
    };
    console.log(articleDTO);
    formData.append("articleDTO", JSON.stringify(articleDTO));

    // 이미지 파일들을 FormData에 추가
    images.forEach((image) => {
      formData.append("file", image);
    });

    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        console.log("게시글 생성 성공", response.data);
        router.push("/community");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "대전왓슈 - create";
    closeDropdown();
    // const token = localStorage.getItem("authToken");
    setToken(localStorage.getItem("authToken") || "");
  }, []);

  return (
    <div>
      <div>
        <div className={style.marginleft}>
          <p className={style.title}>글쓰기 </p>
          <div className={style.descbox}>
            <p className={style.desc}>자신이 다녀온 관광지에 관한 경험을</p>
            <p className={style.desc}>다른 유저와 함께 공유해보세요</p>
          </div>
        </div>
        <div className={style.addimgbox}>
          <label className={style.addimg}>이미지 추가</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple={false}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "spacebetween",
            flexWrap: "wrap",
            width: "100%",
            // height: "240px",
          }}
        >
          {imagePreviews.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                width: "100%",
                height: "100%",
              }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{ margin: "10px", position: "relative" }}
                >
                  <img
                    onClick={() => handleImageRemove(index)}
                    src={preview}
                    alt="preview"
                    style={{
                      width: "220px",
                      height: "220px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={style.catebox}>
          <label className={style.cate} htmlFor="category">
            카테고리
          </label>
          <select id="category" onChange={handleCategory} required>
            <option value="">카테고리 선택</option>
            <option value="맛집">맛집</option>
            <option value="숙소">숙소</option>
            <option value="우천">우천</option>
            <option value="스포츠">스포츠</option>
            <option value="예술">예술</option>
            <option value="빵">빵</option>
            <option value="역사">역사</option>
            <option value="과학">과학</option>
          </select>
        </div>

        <div>
          <input
            className={style.titleinput}
            type="text"
            onChange={handleTitle}
            placeholder="제목"
          />
        </div>
        <div className={style.hr}></div>
        <div>
          <textarea
            className={style.textareainput}
            onChange={handleContent}
            placeholder="본문을 작성하세요"
          />
        </div>
        <div className={style.buttonbox}>
          <button className={style.button} onClick={submit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
