import axios from 'axios';
import {api, fastapi, Authfastapi} from './core';

// 추천 관광지 조회
export async function getRecommendedTouristSpots(category: string) {
  try {
    const response = await api.get(`/tourist/recommend/${category}`);
    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve recommended tourist spots.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get recommended tourist spots error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during recommended tourist spots retrieval:', err);
      return null;
    }
  }
}

// 코스 프리셋 조회
export async function getCoursePresets() {
  try {
    const response = await Authfastapi.get('/courses');
    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve course presets.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get course presets error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course presets retrieval:', err);
      return null;
    }
  }
}
// 코스 상세 조회
export async function getCourseDetail(id: number) {
  try {
    const response = await Authfastapi.get(`/courses/${id}`);
    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve course detail.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get course detail error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course detail retrieval:', err);
      return null;
    }
  }
}
// AI 코스 추천
export async function getAiRecommendedCourse() {
  try {
    const response = await fastapi.get('/courses/chatbot');
    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve AI recommended course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get AI recommended course error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during AI recommended course retrieval:', err);
      return null;
    }
  }
}

// 일정 생성
export async function createCourse(startDate: string, endDate: string) {
  try {
    const response = await api.post('/courses', {
      startDate,
      endDate,
    });

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to create course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Create course error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course creation:', err);
      return null;
    }
  }
}

// 일정 수정 (장소 순서 변경)
export async function updateCourseOrder(coursesId: string, updatedOrder: any) {
  try {
    const response = await api.put(`/courses/${coursesId}`, updatedOrder);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to update course order.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Update course order error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course order update:', err);
      return null;
    }
  }
}

// 장소 추가
export async function addTouristSpotToCourse(coursesId: string, touristSpot: any) {
  try {
    const response = await api.post(`/courses/${coursesId}`, touristSpot);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to add tourist spot to course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Add tourist spot error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during adding tourist spot:', err);
      return null;
    }
  }
}

// 장소 삭제
export async function deleteTouristSpotFromCourse(coursesId: string, touristId: string) {
  try {
    const response = await api.delete(`/courses/${coursesId}/tourist/${touristId}`);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to delete tourist spot from course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Delete tourist spot error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during deleting tourist spot:', err);
      return null;
    }
  }
}
// 챗봇
export async function getChatbotResponse(userInput: string) {
  try {
    // `POST` 요청을 쿼리 매개변수와 함께 보냅니다.
    const response = await Authfastapi.post(`/chat?user_input=${encodeURIComponent(userInput)}`);

    if (response && response.data) {
      return response.data.response; // 응답에서 `response` 필드 가져오기
    } else {
      console.error('Failed to retrieve chatbot response.');
      return '죄송합니다. 요청을 처리할 수 없습니다.';
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Chatbot response error (Axios):', err.response);
      return '죄송합니다. 에러가 발생했습니다.';
    } else {
      console.error('Unexpected error during chatbot response retrieval:', err);
      return '죄송합니다. 에러가 발생했습니다.';
    }
  }
}
// 장소 방문 완료 요청
export async function markSpotAsVisited(courseId: number, spotId: number) {
  try {
    const response = await Authfastapi.post(`/courses/${courseId}/spots/${spotId}/visit`);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to mark spot as visited.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Mark spot as visited error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during marking spot as visited:', err);
      return null;
    }
  }
}
// 챌린지 조회
export async function getUserChallenges() {
  try {
    const response = await Authfastapi.get('/user/challenges');

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve user challenges.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get user challenges error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during user challenges retrieval:', err);
      return null;
    }
  }
}

// 왓슈몬 조회
export async function getUserWassumon() {
  try {
    const response = await Authfastapi.get('/user/wassumon');

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to retrieve user Wassumon.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get user Wassumon error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during user Wassumon retrieval:', err);
      return null;
    }
  }
}
// 코스 시작 API
export async function startCourse(courseId: number) {
  try {
    const response = await Authfastapi.post(`/courses/${courseId}/start`);
    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to start challenge.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Start challenge error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during challenge start:', err);
      return null;
    }
  }
}
export async function getWassumonDetails(spotId: number) {
  try {
    const response = await Authfastapi.get(`/wassumons/${spotId}`);
    if (response && response.data) {
      return response.data.wassumon_details;
    } else {
      console.error('Failed to retrieve Wassumon details.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get Wassumon details error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during Wassumon details retrieval:', err);
      return null;
    }
  }
}
