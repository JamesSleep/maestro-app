import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { useRecoilState } from 'recoil';
import { PROFILE_ARRAY } from 'src/constants/profileArray';
import { tokenState, userState } from 'src/store/recoilState';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

const RouteKR: any = [
  { name: 'League of Legends' },
  { name: '컬렉션' },
  { name: '알림' },
  { name: '설정' },
];

function SideBar({ state, navigation }: DrawerContentComponentProps) {
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setToken('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.picture}
          source={
            PROFILE_ARRAY[user && user.profileIcon ? user.profileIcon : 0]
          }
        />
        <Text style={styles.nickname}>{user?.nickname}</Text>
      </View>
      <View style={styles.menuContainer}>
        {state.routes.map((route, index) => (
          <Pressable
            key={index}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => navigation.navigate(route.name)}>
            <Text
              style={[
                styles.route,
                {
                  color:
                    state.index === index ? appColor.rating : appColor.white,
                  fontFamily:
                    state.index === index
                      ? AppFontFamily.bold
                      : AppFontFamily.regular,
                },
              ]}>
              {RouteKR[index].name}
            </Text>
            {index === 2 && (
              <View style={styles.noti}>
                <Text style={styles.notiCount}>6</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      <View style={styles.footer}>
        <Pressable onPress={() => logout()}>
          <Text style={styles.logout}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(true) / 2,
    paddingHorizontal: 30,
  },
  profileContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 200,
    marginBottom: 10,
  },
  nickname: {
    fontFamily: AppFontFamily.regular,
    fontSize: 25,
    color: appColor.white,
  },
  route: {
    fontFamily: AppFontFamily.bold,
    fontSize: 20,
    color: appColor.white,
    marginRight: 10,
  },
  logout: {
    fontFamily: AppFontFamily.light,
    fontSize: 15,
    color: '#9DA3B4',
  },
  noti: {
    width: 23,
    height: 23,
    borderRadius: 50,
    backgroundColor: '#F95862',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiCount: {
    fontFamily: AppFontFamily.bold,
    fontSize: 16,
    color: appColor.white,
  },
});

export default SideBar;
