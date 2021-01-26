import axios from 'axios';
import { getAuthData, removeToken } from '../store/auth_reducer';

const API_URL = process.env.REACT_APP_API;

const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use(
  async config => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  async config => {
    return config;
  },
  function (error) {
    return Promise.reject(error.response.data);
  }
);

const commonAxios = axios.create({
  baseURL: API_URL,
});

commonAxios.interceptors.request.use(req => {
  const { token } = getAuthData();
  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`;
  }
  return req;
});

commonAxios.interceptors.response.use(
  res => res,
  err => {
    if ([401, 403].includes(err.response.status)) {
      removeToken();
    }
    return Promise.reject(err);
  }
);

export { commonAxios as axios, authAxios };
