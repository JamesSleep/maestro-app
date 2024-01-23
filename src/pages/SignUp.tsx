import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import { AppFontFamily } from '../theme/font';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import { useCallback, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { ApiError } from '../types/api-error';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({ navigation }: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangeNickname = useCallback((text: string) => {
    setNickname(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/user`, {
        email,
        nickname,
        password,
        type: 'origin',
      });
      console.log(response);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      const { message } = errorResponse?.data as ApiError;
      console.log(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Image source={require('../assets/stadium.png')} style={styles.image} />
      <DismissKeyboardView style={styles.front}>
        <View style={{ height: height }}>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Text style={styles.title}>maestro</Text>
            <Text style={styles.subTitle}>계정 생성</Text>
          </View>
          <View style={{ flex: 4, justifyContent: 'center' }}>
            <TextInput
              style={styles.input}
              placeholder="닉네임"
              placeholderTextColor="rgba(255, 242, 248, 0.9)"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 242, 248, 0.9)"
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="rgba(255, 242, 248, 0.9)"
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              placeholderTextColor="rgba(255, 242, 248, 0.9)"
            />
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'space-around',
            }}>
            <Pressable onPress={onSubmit} style={styles.summit}>
              <Text style={styles.summitText}>계정 생성 완료</Text>
            </Pressable>
            <Pressable onPress={toSignIn} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>로그인</Text>
            </Pressable>
          </View>
        </View>
      </DismissKeyboardView>
    </View>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  front: {
    width: width,
    height: height,
    zIndex: 101,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(125,113,199,0.7)',
  },
  image: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    zIndex: 100,
  },
  title: {
    fontSize: 60,
    fontFamily: AppFontFamily.logo,
    color: 'rgba(255, 242, 248, 1)',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 30,
    fontFamily: AppFontFamily.bold,
    color: 'rgba(255, 242, 248, 1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    color: 'rgba(255, 242, 248, 1)',
    textAlign: 'center',
    borderBottomColor: 'rgba(255, 242, 248, 0.5)',
    borderBottomWidth: 1,
    paddingVertical: 25,
    fontSize: 17,
    fontFamily: AppFontFamily.light,
  },
  summit: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 242, 248, 1)',
  },
  summitText: {
    color: '#27272e',
    fontSize: 15,
    fontFamily: AppFontFamily.bold,
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
