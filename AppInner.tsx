import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import HomeStackNavigation from 'src/navigations/HomeStackNavigation';
import RootStackNavigation from 'src/navigations/RootStackNavigation';
import { tokenState } from 'src/store/recoilState';

function AppInner() {
  const [token, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const storeToken = await AsyncStorage.getItem('token');
    if (storeToken) {
      const savedToken = JSON.parse(storeToken);
      setToken(savedToken);
      axios.interceptors.request.use(config => {
        config.headers.Authorization = 'Bearer ' + savedToken;
        return config;
      });
    }
  };

  return token ? <HomeStackNavigation /> : <RootStackNavigation />;
}

export default AppInner;
