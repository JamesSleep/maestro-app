import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import HomeStackNavigation from 'src/navigations/HomeStackNavigation';

import MainDrawNavigation from 'src/navigations/MainDrawNavigation';
import RootStackNavigation from 'src/navigations/RootStackNavigation';
import { tokenState } from 'src/store/recoilState';

function AppInner() {
  const [token, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const savedToken = await AsyncStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  };

  return token ? <HomeStackNavigation /> : <RootStackNavigation />;
}

export default AppInner;
