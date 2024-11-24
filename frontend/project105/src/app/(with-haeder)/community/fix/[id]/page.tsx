"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import style from "./page.module.css";
import axios from "axios";

interface ImageFile {
  file: File | null;
  preview: string | null; // 미리보기 URL 또는 기존 이미지 URL
  isNew: boolean; // 새로 추가된 이미지인지 기존 이미지인지 구분
  url?: string; // 기존 이미지의 경우 서버에서 받아온 실제 URL
}

interface Category {
  tag: string;
}

interface ArticleDTO {
  title: string;
  content: string;
  tags: string[];
}

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  // 상태 관리
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
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
    setCategory([{ tag: e.target.value }]);
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

  // 게시글 상세 조회 axios 요청
  const getArticle = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/read/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("게시글 상세 요청 성공", response.data);
        setArticle(response.data.status);
        setTitle(response.data.status.title);
        setContent(response.data.status.content);
        setCategory(response.data.status.tags);
        // 서버에서 이미지 URL들을 받아오면 이미지 미리보기를 설정
        if (response.data.status.images) {
          const serverImages = response.data.status.images.map(
            (image: { url: string }) => ({
              preview: image.url,
              file: null,
              isNew: false,
              url: image.url,
            })
          );
          // setImages(() => [...serverImages]);
          setImages(response.data.status.images);
          if (response.data.status.images) {
            const serverImagePreviews = response.data.status.images.map(
              (image: { url: string }) => image.url
            );
            setImagePreviews(serverImagePreviews); // 바로 미리보기 상태를 설정
          }
        }
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패", error);
    }
  };

  // 게시글 수정 axios 요청
  const fixRequest = async () => {
    console.log(images);
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    const articleDTO: ArticleDTO = {
      title: title,
      content: content,
      tags: category.map((c) => c.tag),
    };
    console.log(articleDTO);
    formData.append("articleDTO", JSON.stringify(articleDTO));

    // 이미지 파일들을 FormData에 추가
    images.forEach((image) => {
      formData.append("file", image);
    });

    try {
      const response = await axios.put(
        `https://k11b105.p.ssafy.io/wassu/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        console.log("게시글 수정 성공", response.data);
        router.push("/community");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <div>
      <div className={style.marginleft}>
        <p className={style.title}>게시글 수정</p>
        <div className={style.descbox}>
          <p className={style.desc}>자신이 다녀온 관광지에 관한 경험을</p>
          <p className={style.desc}>다른 유저와 함께 공유해보세요</p>
        </div>
      </div>

      {/* 이미지 업로드 및 미리보기 */}
      <div className={style.addimgbox}>
        <label htmlFor="image-upload" className={style.addimg}>
          이미지 추가
        </label>
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* 서버에서 받아온 이미지 미리보기 */}
      <div>
        {images.length > 0 && (
          <div>
            {/* <h3>게시글에 첨부된 이미지 미리보기</h3> */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                width: "750px",
                height: "100%",
              }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{ margin: "10px", position: "relative" }}
                >
                  <img
                    src={preview}
                    alt="preview"
                    onClick={() => handleImageRemove(index)}
                    style={{
                      width: "220px",
                      height: "220px",
                    }}
                  />
                  {/* <button
                    onClick={() => handleImageRemove(index)}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 카테고리 선택 */}
      <div className={style.catebox}>
        <label className={style.cate} htmlFor="category">
          카테고리
        </label>
        <select
          id="category"
          value={category[0]?.tag || ""}
          onChange={handleCategory}
          required
        >
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

      {/* 제목 */}
      <div>
        {/* <label htmlFor="">제목</label> */}
        <input
          className={style.titleinput}
          type="text"
          value={title}
          placeholder="제목을 입력하세요"
          onChange={handleTitle}
        />
      </div>

      <div className={style.hr}></div>

      {/* 내용 */}
      <div>
        {/* <label htmlFor="">내용</label> */}
        <textarea
          className={style.textareainput}
          value={content}
          placeholder="내용을 입력하세요"
          onChange={handleContent}
        />
      </div>

      {/* 수정 완료 버튼 */}
      <div className={style.buttonbox}>
        <button className={style.button} onClick={fixRequest}>
          수정 완료
        </button>
      </div>
    </div>
  );
}
