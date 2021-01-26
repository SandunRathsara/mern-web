import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { message, notification } from 'antd';
import { authAxios, axios } from '../api/base_api';

export const authActions = {
  LOGIN_ATTEMPT: 'auth/login_attempt',
  LOGIN_SUCCESS: 'auth/login_success',
  LOGIN_FAILURE: 'auth/login_failure',
  LOGOUT_ATTEMPT: 'auth/logout_attempt',
  LOGOUT_SUCCESS: 'auth/logout_success',
  LOGOUT_FAILURE: 'auth/logout_failure',
};

const initialState = {
  buttonLoading: false,
  verifyToken: null,
  user: null,
};

const auth_reducer = (state = initialState, action) => {
  switch (action.type) {
    case authActions.LOGIN_ATTEMPT: {
      return { ...state, buttonLoading: true };
    }
    case authActions.LOGIN_SUCCESS: {
      return { ...state, user: action.payload, buttonLoading: false };
    }
    case authActions.LOGIN_FAILURE: {
      return { ...state, buttonLoading: false };
    }
    case authActions.LOGOUT_ATTEMPT: {
      return { ...state, buttonLoading: true };
    }
    case authActions.LOGOUT_SUCCESS: {
      return { ...state, buttonLoading: false, user: null };
    }
    case authActions.LOGOUT_FAILURE: {
      return { ...state, buttonLoading: false, user: null };
    }
    default: {
      return state;
    }
  }
};

export const login = ({ email, password, remember, history }) => async dispatch => {
  try {
    dispatch({ type: authActions.LOGIN_ATTEMPT });

    const { data } = await authAxios.post('auth/dashboard/login/plain', { email, password, appCode: 'TEST-IOS-2' });
    const { token, user } = data.data;
    dispatch({ type: authActions.LOGIN_SUCCESS, payload: user });
    if (remember) {
      setAuthDataToLocalStorage(token, user);
    } else {
      setAuthDataToSessionStorage(token, user);
    }

    if (data.status === 'error' && data.message) {
      message.error(data.message);
    } else if (data.status === 'PASSWORD_RESET_REQUESTED') {
      history.replace('/reset-password');
      notification.info({ message: 'Reset Password', description: 'Please reset your password before login' });
    } else {
      message.success('Successfully logged in');
    }
  } catch (response) {
    dispatch({ type: authActions.LOGIN_FAILURE });
    message.error(response.message);
    return false;
  }
};

export const logout = history => async dispatch => {
  dispatch({ type: authActions.LOGOUT_ATTEMPT });
  try {
    await axios.post('/auth/logout');
    removeToken();
    history.replace('/');
    message.success('Successfully logged out');
    dispatch({ type: authActions.LOGOUT_SUCCESS });
  } catch (e) {
    dispatch({ type: authActions.LOGOUT_FAILURE });
    removeToken();
    message.error(_.get(e, 'response.data.message'));
  }
};

export const resetPassword = (body, history) => async dispatch => {
  dispatch({ type: authActions.TOGGLE_BUTTON_LOADING });
  try {
    const { data } = await axios.post('auth/reset-password', body);
    removeToken();
    history.replace('/');
    message.success(data.message);
    dispatch({ type: authActions.TOGGLE_BUTTON_LOADING });
  } catch ({ response }) {
    dispatch({ type: authActions.TOGGLE_BUTTON_LOADING });
    message.error(response.data.message);
  }
};

const setAuthDataToLocalStorage = (token, user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('json_token', token);
};

const setAuthDataToSessionStorage = (token, user) => {
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('json_token', token);
};

export const getAuthData = () => {
  // Auth state from local storage
  let user = JSON.parse(localStorage.getItem('user'));
  let token = localStorage.getItem('json_token');
  if (user && token) return { token, user };

  // Auth state from session storage
  user = JSON.parse(sessionStorage.getItem('user'));
  token = sessionStorage.getItem('json_token');
  if (user && token) return { token, user };

  return false;
};

export const removeToken = () => {
  localStorage.removeItem('json_token');
  sessionStorage.removeItem('json_token');
};

export const getAuthStateFromToken = () => {
  let token = sessionStorage.getItem('json_token');
  if (!token) {
    token = localStorage.getItem('json_token');
  }

  if (!token) {
    return false;
  }

  const decoded = jwt.decode(token);
  if (!decoded) return false;

  const expDate = new Date(decoded.exp * 1000);
  return expDate > new Date();
};

export const navigate = (route, history) => {
  history.replace(route);
};

export const checkAccessByRole = roleCode => {
  const { user } = getAuthData();
  return user.roles.some(r => r.code === roleCode);
};

export default auth_reducer;
