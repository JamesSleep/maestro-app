import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MatchDetail from 'src/pages/MatchDetail';
import MainDrawNavigation, { MainDrawParamList } from './MainDrawNavigation';
import ProfileIcon from 'src/pages/ProfileIcon';

export type HomeStackParamList = {
  Main: undefined;
  MatchDetail: { id: number; isHeart: boolean; isRated: boolean };
  ProfileIcon: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={'Main'}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Main" component={MainDrawNavigation} />
      <Stack.Screen name="MatchDetail" component={MatchDetail} />
      <Stack.Screen name="ProfileIcon" component={ProfileIcon} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
