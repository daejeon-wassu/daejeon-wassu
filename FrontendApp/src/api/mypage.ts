import axios from 'axios';
import {Authapi} from './core';

export interface UserProfile {
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  level: string;
  exp: number;
  profileImage: string | null;
}

export interface ClearedMarble {
  marble_id: string;
  user_id: string;
  cleared_at: string;
  score: number;
}

export interface UserPost {
  post_id: string;
  title: string;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
}
export interface TravelStamp {
  spot_id: string;
  marble_id: string;
  user_id: string;
  review: string;
  visited_at: string;
}

export interface UserArticle {
  id: string;
  title: string;
  content: string;
  liked: number;
  viewCount: number;
  tags: {tag: string}[];
  images: {url: string}[];
  createdAt: string;
  updatedAt: string;
}

// 사용자 정보 조회
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await Authapi.get('/user/profile');

    if (response && response.status === 200) {
      return response.data as UserProfile;
    } else {
      console.error(response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
    } else {
      console.error(err);
    }
    return null;
  }
}

// 비밀번호 변경
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const response = await Authapi.put('/user/change-password', {
      currentPassword,
      newPassword,
    });

    if (response && response.data && response.data.status === 'success') {
      console.log('Password changed successfully.');
    } else {
      console.error(response.data);
    }

    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
      return err.response;
    } else {
      console.error(err);
      return undefined;
    }
  }
}

// 클리어한 부루마블 조회
export async function getClearedMarbleList() {
  try {
    const response = await Authapi.get('/user/marble/clear-list');

    if (response && response.data && response.data.status === 'success') {
      console.log(response.data.data);
    } else {
      console.error(response.data);
    }
    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
      return err.response;
    } else {
      console.error(err);
      return undefined;
    }
  }
}

//내가 작성한 게시글 조회
export async function getUserPosts(): Promise<UserPost[] | null> {
  try {
    const response = await Authapi.get('/user/posts');

    if (response && response.data) {
      return response.data.data as UserPost[];
    } else {
      console.error(response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
    } else {
      console.error(err);
    }
    return null;
  }
}

// 나의 여행지 조회
export async function getTravelStamps(): Promise<TravelStamp[] | null> {
  try {
    const response = await Authapi.get('/user/travel-stamps');
    if (response && response.data) {
      return response.data.data as TravelStamp[];
    } else {
      console.error(response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
    } else {
      console.error(err);
    }
    return null;
  }
}

// 닉네임 수정
export async function updateNickname(newNickname: string): Promise<boolean> {
  try {
    const response = await Authapi.put('/user/profile/edit/inform', {
      nickName: newNickname,
    });

    if (response && response.status === 200) {
      return true;
    } else {
      console.error('닉네임 수정 실패:', response.data);
      return false;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('닉네임 수정 에러:', err.response);
    } else {
      console.error('닉네임 수정 에러:', err);
    }
    return false;
  }
}

// 이미지 변경
export const updateProfileImage = async (file?: any): Promise<boolean> => {
  try {
    const formData = new FormData();

    // 파일이 있는 경우에만 FormData에 추가
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'profile_image.jpg',
      });
    }

    const response = await Authapi.put('/user/profile/edit/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200 && response.data.status === 'success') {
      return true;
    } else {
      console.error('프로필 이미지 변경 실패:', response.data);
      return false;
    }
  } catch (error) {
    console.error('프로필 이미지 변경 에러:', error);
    return false;
  }
};

// 나의 게시글
export async function getUserArticles(): Promise<UserArticle[] | null> {
  try {
    const response = await Authapi.get('/user/article');

    if (response && response.status === 200) {
      const articles = response.data as UserArticle[];
      return articles;
    } else {
      console.error('나의 게시글 불러오기 실패:', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('나의 게시글 불러오기 에러:', err.response);
    } else {
      console.error('나의 게시글 불러오기 에러:', err);
    }
    return null;
  }
}
