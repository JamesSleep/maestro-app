import { NavigatorScreenParams } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Match from 'src/pages/Match';
import MainDrawNavigation, { MainDrawParamList } from './MainDrawNavigation';

export type HomeStackParamList = {
  Main: NavigatorScreenParams<MainDrawParamList>;
  Match: undefined;
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
      <Stack.Screen name="Match" component={Match} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
