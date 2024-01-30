import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from 'react-query';
import { useRecoilState } from 'recoil';

import { AppFontFamily } from 'src/theme/font';
import DismissKeyboardView from 'src/components/DismissKeyboardView';
import { ApiError } from 'src/types/api-error';
import { showToastError } from 'src/utils/toastMessage';
import { tokenState, userState } from 'src/store/recoilState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from 'src/navigations/HomeStackNavigation';
import { fetchApi } from 'src/api/fetchApi';
import { User } from 'src/api/DataType';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type SignInScreenProps = NativeStackScreenProps<HomeStackParamList, 'SignIn'>;

function SignIn({ navigation }: SignInScreenProps) {
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const { mutate, isLoading } = useMutation(
    ['signIn'],
    (query: { email: string; password: string }) =>
      fetchApi.post(`/user/login`, query),
    {
      onSuccess: async response => {
        const {
          data: { data },
        } = response;
        setToken(data.token);
        await AsyncStorage.setItem('token', JSON.stringify(data.token));
        fetchApi.defaults.headers.Authorization = 'Bearer ' + data.token;
      },
      onError: error => {
        const errorResponse = (error as AxiosError).response;
        const { message } = errorResponse?.data as ApiError;
        showToastError('로그인실패', message);
      },
    },
  );

  const userInfoQuery = useQuery(
    ['getUserInfo'],
    () => fetchApi.get(`/user/current`),
    {
      enabled: !isLoading && !!token,
      onSuccess: response => {
        //console.log(response);
        const userData: User = response.data.data;
        setUser(userData);
        if (!userData.profileIcon) {
          navigation.replace('ProfileIcon');
        }
        navigation.replace('Main');
      },
    },
  );

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (isLoading) return;
    mutate({ email, password });
  }, [isLoading, navigation, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const getToken = async () => {
    const storeToken = await AsyncStorage.getItem('token');
    if (storeToken) {
      const savedToken = JSON.parse(storeToken);
      setToken(savedToken);
      fetchApi.defaults.headers.Authorization = 'Bearer ' + savedToken;
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <DismissKeyboardView bounce={false} scrollEnabled={false}>
      <View
        style={{
          flex: 1,
        }}>
        <Image source={require('../assets/deft.png')} style={styles.image} />
        <LinearGradient
          colors={['black', 'rgba(0,0,0,0.4)', 'black']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linear}>
          <View style={{ flex: 12, justifyContent: 'center' }}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 242, 248, 0.6)"
              onChangeText={onChangeEmail}
              textContentType="emailAddress"
              value={email}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={emailRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="rgba(255, 242, 248, 0.6)"
              onChangeText={onChangePassword}
              textContentType="password"
              value={password}
              secureTextEntry
              returnKeyType="send"
              clearButtonMode="while-editing"
              ref={passwordRef}
              onSubmitEditing={onSubmit}
            />
            <Pressable onPress={onSubmit}>
              <LinearGradient
                colors={['#fc8263', '#973e7e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>로그인</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>
                비밀번호를 잊어버리셨나요? 비밀번호 찾기
              </Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Pressable onPress={toSignUp} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>계정생성</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </DismissKeyboardView>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  linear: {
    height: height,
    zIndex: 101,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  image: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    zIndex: 100,
  },
  input: {
    width: '100%',
    color: 'rgba(255, 242, 248, 0.6)',
    textAlign: 'center',
    borderBottomColor: 'rgba(255, 242, 248, 0.5)',
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 40,
    fontSize: 20,
    fontFamily: AppFontFamily.light,
  },
  loginBtn: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: 'rgba(255, 242, 248, 1)',
    fontSize: 15,
    fontFamily: AppFontFamily.regular,
  },
  forgotBtn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    color: 'rgba(255, 242, 248, 1)',
    fontSize: 14,
    fontFamily: AppFontFamily.regular,
  },
});
