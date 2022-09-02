import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials } from '../../features/login/types';
import { api } from '../../api';
import { SignUpData } from '../../features/SignUp/types';
import { LS_TOKEN_KEY_NAME } from '../../api/config';
import { SLICE_NAME } from './types';
import { authSlice } from './index';

export const loginThunk = createAsyncThunk(
  `${SLICE_NAME}/loginThunk`,
  async (credential: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.auth.login(credential);

      dispatch(authSlice.actions.setIsAuth(true));

      return response;
    } catch (e: any) {
      if (!e?.response?.data) {
        throw e;
      }
      return rejectWithValue(e?.response?.data);
    }
  },
);

interface SingUpThunkPayload {
  signUpData: SignUpData;
  successCb: () => void;
}

export const singUpThunk = createAsyncThunk(
  `${SLICE_NAME}/singUpThunk`,
  async ({ signUpData, successCb }: SingUpThunkPayload, { rejectWithValue }) => {
    try {
      const response = await api.auth.signUp(signUpData);
      successCb();
      return response;
    } catch (e: any) {
      if (!e?.response?.data) {
        throw e;
      }
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const logout = createAsyncThunk(`${SLICE_NAME}/logout`, async (_, { dispatch }) => {
  dispatch(authSlice.actions.setIsAuth(false));
  localStorage.removeItem(LS_TOKEN_KEY_NAME);
});

interface JWTPayload {
  email: string;
  iat: number;
  exp: number;
  sub: string;
}

export const checkTokenThunk = createAsyncThunk(
  `${SLICE_NAME}/checkTokenThunk`,
  async (_, { dispatch }) => {
    const token = localStorage.getItem(LS_TOKEN_KEY_NAME);
    if (!token) {
      return;
    }
    const tokenData: JWTPayload = JSON.parse(atob(token.split('.')[1]));

    const tokenExp = tokenData.exp * 1000;
    const currentTime = new Date().getTime();

    if (tokenExp > currentTime) {
      const usersList = await api.auth.fetchUsers();
      const currentUser = usersList.find((item) => item.email === tokenData.email);

      if (!currentUser) {
        localStorage.removeItem(LS_TOKEN_KEY_NAME);
        return;
      }
      dispatch(authSlice.actions.setIsAuth(true));
      dispatch(authSlice.actions.setUserData(currentUser));
    }
  },
);
