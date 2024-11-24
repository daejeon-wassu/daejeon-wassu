import axios from 'axios';
import {api, Authapi} from './core';
import {saveTokens, getTokens, removeTokens} from '../utills/tokenStorage';

//회원가입 이메일 인증 확인
export async function sendVerificationCode(email: string) {
  try {
    const response = await api.post('/auth/send-verification-code', null, {
      params: {email: email},
    });
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.error(err.response);
        return err.response;
      }
    } else {
      console.error(err);
      return undefined;
    }
  }
}

// 로그인
export async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', {email, password});

    if (response && response.data) {
      const {access: accessToken, refresh: refreshToken} = response.data;

      if (accessToken && refreshToken) {
        await saveTokens(accessToken, refreshToken);
      } else {
        console.error('Access token or refresh token is missing.');
      }
    } else {
      console.error('No response data.');
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

//로그아웃
export async function logout() {
  try {
    const {accessToken} = await getTokens();

    if (!accessToken) {
      return;
    }
    const response = await Authapi.post('/auth/logout', null);

    if (response.status === 200) {
      await removeTokens();
    } else {
      console.error(response.status);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
    } else {
      console.error(err);
    }
  }
}

// 코드 인증 요청
export async function verifyCode(email: string, code: string) {
  try {
    const response = await api.post('/auth/verify-code', null, {
      params: {email, code},
    });

    if (response && response.status === 200 && response.data.status === 'success') {
      return true;
    } else {
      console.error(response.data);
      return false;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
      return false;
    } else {
      console.error(err);
      return false;
    }
  }
}

// 회원가입
export async function signUp(
  email: string,
  password: string,
  gender: string,
  birthYear: number,
  nickname: string,
) {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
      gender,
      birthYear,
      nickname,
    });

    if (response && response.status === 200 && response.data.status === 'success') {
      return response.data;
    } else {
      console.error(response.data);
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

//회원탈퇴
export async function deleteAccount() {
  try {
    const response = await Authapi.delete('/auth/delete-account');

    if (response && response.status === 200 && response.data.status === 'success') {
      await removeTokens();
      return true;
    } else {
      console.error(response.data);
      return false;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response);
    } else {
      console.error(err);
    }
    return false;
  }
}
