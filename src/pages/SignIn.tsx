import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppFontFamily } from '../theme/font';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function SignIn() {
  return (
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
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="rgba(255, 242, 248, 0.6)"
          />
          <Pressable>
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
          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>회원가입하기</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
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
