import axios from 'axios';
import {api, Authapi} from './core';

export interface TouristSpot {
  id: string;
  spotName: string;
  spotAddress: string;
  image: string | null;
}

export interface TouristSpotDetails {
  spot_id: string;
  spot_name: string;
  spot_addr: string;
  site_url: string;
  detail: string;
  tags: string[];
  images: string[];
  favorite: boolean; // 추가
  favoritesCount: number; // 추가
  Liked: boolean;
  stamped: boolean; // 추가된 필드
}

export interface TouristSpotLocation {
  longitude: number;
  latitude: number;
}

export interface TouristSpotReview {
  visited_spot_id: string;
  user: {
    user_id: string;
    nickname: string;
    level: number;
  };
  review: string;
  visited_at: string;
}

export interface ReviewDetails {
  reviewId: string;
  content: string;
  likeCount: number;
  profile: {
    email: string;
    nickname: string;
    profileImageUrl: string;
  };
  reviewImages: {imageId: number; imageUrl: string}[];
  isLiked: boolean;
  createdAt: string;
}

// 관광지 검색
export async function getTouristSpots(
  query: string,
  page = 1,
  size = 10,
  sort?: string,
): Promise<TouristSpot[] | null> {
  try {
    const response = await api.get('/tourist/search', {
      params: {query, page, size, sort},
    });

    if (response && response.status === 200) {
      return response.data.data as TouristSpot[];
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

// 카테고리별 조회
export async function getTouristSpotsByCategory(category: string): Promise<TouristSpot[] | null> {
  try {
    const response = await api.get('/tourist/filter', {
      params: {category},
    });

    if (response && response.status === 200) {
      const spots: TouristSpot[] = response.data.content.map((spot: any) => ({
        id: spot.id,
        spotName: spot.spotName,
        spotAddress: spot.spotAddress,
        image: spot.images.length > 0 ? spot.images[0].image : null,
      }));
      return spots;
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

export async function getTouristSpotsByCategorys(category: string): Promise<TouristSpot[] | null> {
  try {
    const response = await api.get('/tourist/filter', {
      params: {category, size: 50},
    });

    if (response && response.status === 200) {
      const spots: TouristSpot[] = response.data.content.map((spot: any) => ({
        id: spot.id,
        spotName: spot.spotName,
        spotAddress: spot.spotAddress,
        image: spot.images.length > 0 ? spot.images[0].image : null,
      }));
      return spots;
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

// 관광지 상세보기 정보
export async function getTouristSpotDetails(id: string): Promise<TouristSpotDetails | null> {
  try {
    const response = await Authapi.get(`/tourist/details/${id}`);

    if (response && response.status === 200) {
      return response.data as TouristSpotDetails;
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

// 관광지 상세보기 위치
export async function getTouristSpotLocation(id: string): Promise<TouristSpotLocation | null> {
  try {
    const response = await api.get(`/tourist/location/${id}`);

    if (response && response.status === 200) {
      return response.data as TouristSpotLocation;
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

// 관광지 상세보기 후기
export async function getTouristSpotReviews(id: string): Promise<TouristSpotReview[] | null> {
  try {
    const response = await api.get(`/tourist/reviews/${id}`);

    if (response && response.status === 200) {
      return response.data.visited_spots as TouristSpotReview[];
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

// 후기 작성

// API 호출 함수
export async function createReview(
  spotId: string,
  review: {content: string},
  image: any[],
): Promise<boolean | null> {
  try {
    const formData = new FormData();
    formData.append('review', JSON.stringify(review)); // content를 JSON 문자열로 추가

    // 이미지 파일이 있을 경우에만 추가
    image.forEach((file, index) => {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `image_${index}.jpg`,
      } as unknown as Blob);
    });

    const response = await Authapi.post(`/tourist/${spotId}/review`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response && response.status === 200 && response.data === 'review created') {
      return true;
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

// 후기 좋아요
export async function likeReview(reviewId: string): Promise<boolean | null> {
  try {
    const response = await Authapi.post(`/review/${reviewId}/likes`);

    if (response && response.status === 200 && response.data === 'review liked') {
      return true;
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

export async function unlikeReview(reviewId: string): Promise<boolean | null> {
  try {
    const response = await Authapi.delete(`/review/${reviewId}/likes`);

    if (response && response.status === 200 && response.data === 'review unliked') {
      return true;
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

// 찜하기
export async function favoriteTouristSpot(
  spotId: string,
): Promise<{totalFavorites: number; userLiked: boolean} | null> {
  try {
    const response = await Authapi.post(`/tourist/${spotId}/favorite`);
    if (
      response &&
      response.status === 200 &&
      response.data.message === 'Spot successfully liked'
    ) {
      return {
        totalFavorites: response.data.totalFavorites,
        userLiked: response.data.userLiked,
      };
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
// 찜 취소하기
export async function unfavoriteTouristSpot(
  spotId: string,
): Promise<{totalFavorites: number; userLiked: boolean} | null> {
  try {
    const response = await Authapi.delete(`/tourist/${spotId}/favorite`);
    if (
      response &&
      response.status === 200 &&
      response.data.message === 'Spot successfully unliked'
    ) {
      return {
        totalFavorites: response.data.totalFavorites,
        userLiked: response.data.userLiked,
      };
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
// 후기 상세 조회
export async function getReviewDetails(reviewId: string): Promise<ReviewDetails | null> {
  try {
    const response = await Authapi.get(`/review/${reviewId}`);

    if (response && response.status === 200) {
      return response.data as ReviewDetails;
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
// 관광지 스탬프 등록
export async function registerTouristStamp(
  elasticSpotId: string,
  currentLatitude: string,
  currentLongitude: string,
  category: string,
): Promise<'success' | 'out of range' | 'already stamped' | null> {
  try {
    const response = await Authapi.post('/tourist/stamp', {
      elasticSpotId,
      currentLatitude,
      currentLongitude,
      category,
    });

    if (response && response.status === 200) {
      const {status} = response.data;
      if (status === 'success' || status === 'out of range' || status === 'already stamped') {
        return status;
      } else {
        console.error('Unexpected status:', status);
        return null;
      }
    } else {
      console.error(response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 404) {
        const {status} = err.response.data;
        if (status === 'out of range' || status === 'already stamped') {
          return status;
        }
      }
      console.error(err.response);
    } else {
      console.error(err);
    }
    return null;
  }
}

// 보유한 스탬프 조회
export async function getTouristStamps(): Promise<{category: string; spotName: string}[] | null> {
  try {
    const response = await Authapi.get('/tourist/stamp/detail');

    if (response && response.status === 200) {
      return response.data as {category: string; spotName: string}[];
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
