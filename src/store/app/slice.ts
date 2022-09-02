import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './types';

const initialState: AppState = {
  redirectUrl: null,
};

export const { actions, reducer } = createSlice({
  name: 'app',
  initialState,
  reducers: {
    redirect: (state, action: PayloadAction<string>) => {
      state.redirectUrl = {
        path: action.payload,
      };
    },
  },
});
