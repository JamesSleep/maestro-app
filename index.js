/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import axios, { AxiosError } from 'axios';

axios.interceptors.response.use(
  response => {
    return response;
    /*   const {
      data: {
        data: { statusCode },
      },
    } = response;

    if (statusCode < 400) return response.data;
    else throw new Error(response.data.data.message); */
  },
  async error => {
    return Promise.reject(error);
  },
);

AppRegistry.registerComponent(appName, () => App);
