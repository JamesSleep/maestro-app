import { NavigatorScreenParams } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MatchDetail from 'src/pages/MatchDetail';
import MainDrawNavigation, { MainDrawParamList } from './MainDrawNavigation';
import { Match } from 'src/api/DataType';

export type HomeStackParamList = {
  Main: NavigatorScreenParams<MainDrawParamList>;
  MatchDetail: { id: number };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Main" component={MainDrawNavigation} />
      <Stack.Screen name="MatchDetail" component={MatchDetail} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
