import { RequestSliceStateProperty, RootState } from '../types';
import { UserData } from './types';

export const getIsAuth = (state: RootState): boolean => state.auth.isAuth;

export const getLoginRequest = (state: RootState): RequestSliceStateProperty<UserData> =>
  state.auth.loginRequest;

export const getSignUpRequest = (state: RootState) => state.auth.signUpRequest;
