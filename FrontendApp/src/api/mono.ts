import axios from 'axios';
import {Authapi, api} from './core';
import Geolocation from '@react-native-community/geolocation';
import {getTokens} from '../utills/tokenStorage';

interface Node {
  nodeId: number;
  spotId: number;
  spotName: string;
  thumbnail: string;
  nodeOrder: number;
}

interface User {
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  level: string;
  exp: number;
  profileImage: string;
}

interface Opponent {
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  level: string;
  exp: number;
  profileImage: string | null;
}

interface RoomDetails {
  roomId: number;
  marbleId: number;
  marbleName: string;
  single: boolean;
  nodes: Node[];
  you: User;
  opponent?: Opponent;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

// 테마보드로 방만들기
export async function postMarble(
  marbled: string,
  single: boolean,
): Promise<{roomId: number} | null> {
  try {
    const response = await Authapi.post(`/marble/${marbled}`, {
      single: single,
    });

    if (response.status === 200) {
      return response.data; // roomId 반환
    } else {
      console.error('마블 데이터 전송 실패:', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('마블 데이터 전송 에러:', err.response);
    } else {
      console.error('마블 데이터 전송 에러:', err);
    }
    return null;
  }
}

export async function postMarbles(
  marbled: string,
  single: boolean,
): Promise<{roomId: number; inviteCode?: string}> {
  try {
    const response = await Authapi.post(`/marble/${marbled}`, {single});
    if (response.status === 200) {
      return response.data; // roomId와 inviteCode 반환
    } else {
      return {roomId: 0}; // 실패 시 기본값 반환
    }
  } catch (error) {
    console.error('postMarbles 에러:', error);
    throw error;
  }
}

// 조회
export async function getRoomDetails(roomId: number): Promise<RoomDetails> {
  try {
    const response = await Authapi.get(`/marble/room/${roomId}`);

    if (response.status === 200) {
      return response.data as RoomDetails; // 명시적 타입 변환
    } else {
      console.error('방 상세 정보 조회 실패:', response.data);
      throw new Error('방 상세 정보 조회 실패');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('방 상세 정보 조회 에러:', err.response);
    } else {
      console.error('방 상세 정보 조회 에러:', err);
    }
    throw err;
  }
}

// 위치 인증 요청
export async function verifyLocation(
  roomId: number,
  nodeId: number,
): Promise<{verified: boolean} | any> {
  try {
    const position = await new Promise<LocationData>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => reject(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
    const {latitude, longitude} = position;
    // 서버로 인증 요청
    const response = await Authapi.post(`/marble/room/${roomId}/mission/${nodeId}/verify`, {
      latitude,
      longitude,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('위치 인증 실패:', response.data.message);
      throw new Error(`인증 실패: ${response.data.message}`);
    }
  } catch (error) {
    console.error('위치 인증 에러:', error);
    throw error;
  }
}

// 게임 플레이
export async function playMarble(
  roomId: number,
  action: 'roll-dice' | 'reroll' | 'pass',
): Promise<{
  [x: string]: any;
  success: boolean;
  message?: string;
}> {
  try {
    // 서버로 요청
    const response = await Authapi.post(`/marble/play/${roomId}`, null, {
      params: {
        action,
      },
    });

    if (response.status === 200) {
      return {success: true, message: response.data.status}; // 성공 응답
    } else {
      console.error('게임 플레이 요청 실패:', response.data);
      return {success: false, message: response.data.message}; // 실패 응답
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('게임 플레이 요청 에러:', err.response);
      return {success: false, message: err.response?.data?.message || '알 수 없는 오류'};
    } else {
      console.error('게임 플레이 요청 에러:', err);
      return {success: false, message: '게임 플레이 중 에러 발생'};
    }
  }
}

// 게임 종료
export async function endGame(roomId: number): Promise<{status: string}> {
  try {
    // 서버로 요청
    const response = await Authapi.delete(`/marble/room/${roomId}/complete`);

    if (response.status === 200) {
      return {status: response.data.status || 'marble deleted'}; // 성공 응답
    } else {
      console.error('게임 종료 요청 실패:', response.data);
      throw new Error(response.data.message || '게임 종료 실패'); // 실패 응답
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('게임 종료 요청 에러:', err.response);
      throw new Error(err.response?.data?.status || '알 수 없는 오류');
    } else {
      console.error('게임 종료 요청 에러:', err);
      throw new Error('게임 종료 중 에러 발생');
    }
  }
}

// 초대코드 재생성
export async function regenerateInviteCode(roomId: number): Promise<{inviteCode: string}> {
  try {
    // 서버로 POST 요청
    const response = await Authapi.post(`/marble/room/${roomId}/code`);

    if (response.status === 200) {
      return response.data; // inviteCode 반환
    } else {
      console.error('초대코드 재생성 실패:', response.data);
      throw new Error(response.data.message || '초대코드 재생성 실패');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('초대코드 재생성 요청 에러:', err.response);
      throw new Error(err.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('초대코드 재생성 요청 에러:', err);
      throw new Error('초대코드 재생성 중 에러 발생');
    }
  }
}

// 방 입장하기
export async function joinRoom(inviteCode: string): Promise<{roomId: number}> {
  try {
    // 서버로 POST 요청
    const response = await Authapi.post(`/marble/room/join`, {
      inviteCode,
    });

    if (response.status === 200) {
      return response.data; // roomId 반환
    } else {
      console.error('방 입장 실패:', response.data);
      throw new Error(response.data.message || '방 입장 실패');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('방 입장 요청 에러:', err.response);
      throw new Error(err.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('방 입장 요청 에러:', err);
      throw new Error('방 입장 중 에러 발생');
    }
  }
}

// 진행 중인 마블 조회
export async function getMyMarble(): Promise<{roomId: number; single: boolean} | null> {
  try {
    // GET 요청으로 진행 중인 마블 정보 조회
    const response = await Authapi.get(`/marble/my`);

    if (response.status === 200) {
      if (response.data.message === 'no room') {
        return null; // 진행 중인 마블이 없을 경우 null 반환
      }
      return response.data; // roomId와 single 값을 반환
    } else {
      console.error('진행 중인 마블 조회 실패:', response.data);
      return null; // 실패 시 null 반환
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('진행 중인 마블 조회 요청 에러:', error.response);
    } else {
      console.error('진행 중인 마블 조회 요청 에러:', error);
    }
    return null; // 에러 발생 시 null 반환
  }
}

// 테마보드 생성
export async function postCustomMarble(
  preference: string,
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  single: boolean,
): Promise<{roomId: number} | null> {
  try {
    const response = await Authapi.post(
      `/marble/route`,
      {
        preference,
        start_lat: startLat,
        start_lon: startLon,
        end_lat: endLat,
        end_lon: endLon,
      },
      {
        params: {
          single, // URL 쿼리 파라미터로 전달
        },
      },
    );

    if (response.status === 200) {
      return response.data; // roomId 반환
    } else {
      console.error('맞춤 보드 생성 실패:', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('맞춤 보드 생성 요청 에러:', err.response);
    } else {
      console.error('맞춤 보드 생성 요청 에러:', err);
    }
    return null;
  }
}

export async function postCustomMarbles(
  preference: string,
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  single: boolean,
): Promise<{roomId: number; inviteCode: string} | null> {
  try {
    const response = await Authapi.post(
      '/marble/route',
      {
        preference,
        start_lat: startLat,
        start_lon: startLon,
        end_lat: endLat,
        end_lon: endLon,
      },
      {
        params: {
          single, // URL 쿼리 파라미터로 전달
        },
      },
    );

    if (response.status === 200) {
      return response.data; // roomId와 inviteCode 반환
    } else {
      console.error('맞춤 보드 생성 실패:', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('맞춤 보드 생성 요청 에러:', err.response);
    } else {
      console.error('맞춤 보드 생성 요청 에러:', err);
    }
    return null;
  }
}
