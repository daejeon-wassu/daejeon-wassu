import axios from 'axios';
import {Authapi, api} from './core';

export interface Article {
  id: string;
  user: number;
  title: string;
  content: string;
  tags: {tag: string}[];
  images: {url: string}[];
  viewCount: number;
  liked: number;
  createdAt: string;
  updatedAt: string;
  nickName: string;
  profileImage: string;
}

export interface FilteredPostsResponse {
  content: Article[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface ArticleDTO {
  title: string;
  content: string;
  tags: string[];
  place?: string;
}

// 게시글 작성
export const createPost = async (
  articleDTO: ArticleDTO,
  files: any[],
): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append('articleDTO', JSON.stringify(articleDTO));

    files.forEach((file, index) => {
      formData.append(`file`, {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || `image_${index}.jpg`,
      });
    });

    const response = await Authapi.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.articleId;
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (
  articleId: string,
  articleDTO: ArticleDTO,
  files: any[],
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('articleDTO', JSON.stringify(articleDTO));

    files.forEach((file, index) => {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || `image_${index}.jpg`,
      });
    });

    const response = await Authapi.put(`/posts/${articleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const response = await Authapi.delete(`/posts/${postId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('게시글 삭제 실패 (Axios 에러):', error.response);
    } else {
      console.error('게시글 삭제 실패 (예기치 않은 에러):', error);
    }
    throw error;
  }
};

// 게시글 조회
export async function getPosts(category: string) {
  try {
    const response = await Authapi.get(`/posts/${category}`);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve posts.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get posts error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during posts retrieval:', err);
      return null;
    }
  }
}

// 게시글 상세 조회
export async function getPostDetail(articleId: string) {
  try {
    const response = await Authapi.get(`/posts/read/${articleId}`);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('디테일 결과 수신 실패');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
      return null;
    } else {
      console.error(err);
      return null;
    }
  }
}

// 게시글 좋아요/취소
export async function toggleLike(articleId: string, userLiked: boolean) {
  try {
    const action = userLiked ? 'unlike' : 'like';
    const url = `https://k11b105.p.ssafy.io/wassu/posts/${articleId}/likes?action=${action}`;

    const response = await Authapi.post(url, null);

    if (response && response.status === 200) {
      return response.data;
    } else {
      console.error('좋아요/좋아요 취소 요청 실패');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('API 에러:', err.response);
      return null;
    } else {
      console.error('알 수 없는 에러:', err);
      return null;
    }
  }
}

// 게시글 검색
export async function searchPosts(searchText: string) {
  try {
    const response = await api.post('/posts/search', {searchText: searchText});

    if (response && response.data) {
      return response.data;
    } else {
      console.error('검색 결과 수신 실패');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
      return null;
    } else {
      console.error(err);
      return null;
    }
  }
}

// 게시글 태그 필터링
export async function filterPosts(category?: string): Promise<FilteredPostsResponse | null> {
  try {
    const response = await Authapi.get('/posts/filter', {
      params: {
        category: category || '',
      },
    });

    if (response.status === 200) {
      return response.data as FilteredPostsResponse;
    } else {
      console.error(response.status);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 인기 게시글 조회
export async function getRecommendedPosts(): Promise<Article[] | null> {
  try {
    const response = await api.get('/posts/read/recommend');

    if (response && response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('인기 게시글 조회 실패');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('인기 게시글 조회 실패 (Axios 에러):', error.response);
    } else {
      console.error('인기 게시글 조회 실패 (예기치 않은 에러):', error);
    }
    return null;
  }
}
