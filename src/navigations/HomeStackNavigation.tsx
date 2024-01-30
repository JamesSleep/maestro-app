import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MatchDetail from 'src/pages/MatchDetail';
import MainDrawNavigation, { MainDrawParamList } from './MainDrawNavigation';
import ProfileIcon from 'src/pages/ProfileIcon';
import SignIn from 'src/pages/SignIn';
import SignUp from 'src/pages/SignUp';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResetRecoilState } from 'recoil';
import { userState } from 'src/store/recoilState';
import {
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import { Match, Player } from 'src/api/DataType';
import ReviewPage from 'src/pages/ReviewPage';
import PlayerPage from 'src/pages/PlayerPage';

export type HomeStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  MatchDetail: { id: number; isHeart: boolean; isRated: boolean };
  ProfileIcon: undefined;
  ReviewPage: Match;
  PlayerPage: { player: Player; isHeart: boolean; matchId: number };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export const navigationRef = createNavigationContainerRef<HomeStackParamList>();

export function navigate(name: any, params?: any) {
  navigationRef.current?.navigate(name, params);
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={'SignIn'}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Main" component={MainDrawNavigation} />
      <Stack.Screen name="MatchDetail" component={MatchDetail} />
      <Stack.Screen name="ProfileIcon" component={ProfileIcon} />
      <Stack.Screen name="ReviewPage" component={ReviewPage} />
      <Stack.Screen name="PlayerPage" component={PlayerPage} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
