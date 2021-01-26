import { message } from 'antd';
import { axios } from '../api/base_api';
import { authActions } from './auth_reducer';

const userActions = {
  FETCH_USERS_ATTEMPT: 'users/fetch_users_attempt',
  FETCH_USERS_SUCCESS: 'users/fetch_users_success',
  FETCH_USERS_FAIL: 'users/fetch_users_fail',
};

const initialState = {
  users: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.FETCH_USERS_ATTEMPT: {
      return { ...state, tableLoading: true };
    }
    case userActions.FETCH_USERS_SUCCESS: {
      return { ...state, users: action.payload.users, totalUsers: action.payload.count, tableLoading: false };
    }
    case userActions.FETCH_USERS_FAIL: {
      return { ...state, tableLoading: false };
    }
    case authActions.LOGOUT_SUCCESS:
      return initialState;
    default: {
      return state;
    }
  }
};

export const fetchUsers = (filters, page = 1, pageSize = 20) => async dispatch => {
  dispatch({ type: userActions.FETCH_USERS_ATTEMPT });
  try {
    const { data } = await axios.get(
      `users?page=${page}&pageSize=${pageSize}&${new URLSearchParams(filters).toString()}`
    );
    dispatch({ type: userActions.FETCH_USERS_SUCCESS, payload: data.data });
  } catch (e) {
    dispatch({ type: userActions.FETCH_USERS_FAIL });
    message.error('Fetch users failed');
  }
};

export const fetchRoles = () => async dispatch => {
  try {
    const { data } = await axios.get('roles');
    dispatch({ type: userActions.FETCH_ROLES, payload: data.data });
  } catch (e) {
    message.error('Something went wrong!!! could not fetch Roles');
  }
};

export const updateUser = body => async dispatch => {
  body.initialized = true;
  dispatch({ type: userActions.UPDATE_USERS_ATTEMPT });
  try {
    const { data } = await axios.put('users', body);
    dispatch({ type: userActions.UPDATE_USERS_SUCCESS, payload: data.data });
    message.success('Successfully Updated');
  } catch (e) {
    dispatch({ type: userActions.UPDATE_USERS_FAIL });
    message.error('Update user failed. Please try again later');
  }
};

export const switchActiveStatus = id => async dispatch => {
  dispatch({ type: userActions.CHANGE_ACTIVE_STATE_ATTEMPT });
  try {
    const { data } = await axios.put('users/switch-active-state', { userId: id });
    dispatch({ type: userActions.CHANGE_ACTIVE_STATE_SUCCESS, payload: data.data });
    message.success('Successfully updated the status');
  } catch (e) {
    dispatch({ type: userActions.CHANGE_ACTIVE_STATE_FAIL });
    message.error('Update user failed. Please try again later');
  }
};

export const switchLockStatus = id => async dispatch => {
  dispatch({ type: userActions.CHANGE_LOCK_STATE_ATTEMPT });
  try {
    const { data } = await axios.put('users/switch-lock-state', { userId: id });
    dispatch({ type: userActions.CHANGE_LOCK_STATE_SUCCESS, payload: data.data });
    message.success('Successfully updated the status');
  } catch (e) {
    dispatch({ type: userActions.CHANGE_LOCK_STATE_FAIL });
    message.error('Update user failed. Please try again later');
  }
};

export default reducer;
