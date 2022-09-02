import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

import { LS_TOKEN_KEY_NAME } from './config';

export const requestExecutorCreator =
  (baseUrl: string, apiDefaultRequestHeaders: AxiosRequestHeaders, isAuth = true) =>
  async <T = unknown>(requestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    const headers: AxiosRequestHeaders = {
      ...requestConfig.headers,
      ...apiDefaultRequestHeaders,
    };

    if (isAuth) {
      headers.Authorization = `Bearer ${localStorage.getItem(LS_TOKEN_KEY_NAME)}`;
    }

    const finalRequestConfig: AxiosRequestConfig = {
      ...requestConfig,
      baseURL: baseUrl,
      headers,
    };

    return axios.request<T>(finalRequestConfig);
  };
