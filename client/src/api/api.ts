import axios, { HttpStatusCode } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // import.meta.env.SERVER_BASE_URL,
  timeout: 100000
});

const refreshApi = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true
});

// 토큰 갱신
const refreshAuthToken = async () => {
  try {
    const response = await refreshApi.post(`api/auth/token`);
    return response.data.token;
  } catch (err) {
    console.error('Refresh token failed:', err);
    throw err;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지 설정

      try {
        const res = await refreshAuthToken();
        Cookies.set('login', res);

        return api(originalRequest); // 원래 요청 다시 시도
      } catch (err) {
        Cookies.remove('login');
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const get = async (
  url: string,
  params?: any,
  withCredentials: boolean = true
) => {
  try {
    const response = await api.get(url, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`GET request to ${url} failed`, error);
    throw error;
  }
};

export const post = async (
  url: string,
  data?: any,
  params?: any,
  withCredentials: boolean = true
) => {
  try {
    const response = await api.post(url, data, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${url} failed`, error);
    throw error;
  }
};

export const put = async (
  url: string,
  data: any,
  params?: any,
  withCredentials: boolean = true
) => {
  try {
    const response = await api.put(url, data, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${url} failed`, error);
    throw error;
  }
};

export const del = async (
  url: string,
  params?: any,
  withCredentials: boolean = true
) => {
  try {
    const response = await api.delete(url, { params, withCredentials });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${url} failed`, error);
    throw error;
  }
};

export const patch = async (
  url: string,
  data: any,
  withCredentials: boolean = true
) => {
  try {
    const response = await api.patch(url, data, { withCredentials });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${url} failed`, error);
    throw error;
  }
};
