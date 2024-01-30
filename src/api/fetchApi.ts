import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useRecoilValue } from 'recoil';
import { navigate } from 'src/navigations/HomeStackNavigation';
import { tokenState, userState } from 'src/store/recoilState';
import { showToastError } from 'src/utils/toastMessage';

export const fetchApi = axios.create();

//const getToken = useRecoilValue(tokenState);

fetchApi.defaults.baseURL = Config.API_URL;

fetchApi.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    const errorResponse = (error as AxiosError).response;
    return Promise.reject(error);
  },
);

fetchApi.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const errorResponse = (error as AxiosError).response;
    console.log([
      errorResponse?.request.responseURL,
      errorResponse?.request.status,
    ]);
    if (errorResponse?.request.status === 401) {
      await AsyncStorage.removeItem('token');
      showToastError('로그인실패', '토큰정보가 만료되었습니다.');
      navigate('SignIn');
    }
    return Promise.reject(error);
  },
);
