import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeRequestCaseToBuilder, makeRequestSliceStateProperty } from '../helpers';
import { RequestSliceStateProperty } from '../types';
import { SLICE_NAME, UserData } from './types';
import * as thunks from './thunks';

interface InitialState {
  isAuth: boolean;
  loginRequest: RequestSliceStateProperty<UserData>;
  signUpRequest: RequestSliceStateProperty<unknown>;
}

const initialState: InitialState = {
  isAuth: false,
  loginRequest: makeRequestSliceStateProperty<UserData>(),
  signUpRequest: makeRequestSliceStateProperty<unknown>(),
};

export const { actions, reducer } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.loginRequest.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    makeRequestCaseToBuilder<InitialState>(builder, thunks.loginThunk, 'loginRequest');
    makeRequestCaseToBuilder<InitialState>(builder, thunks.singUpThunk, 'signUpRequest');
  },
});
