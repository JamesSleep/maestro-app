import {
  DrawerScreenProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import {
  HomeStackParamList,
  HomeStackScreenProps,
} from './HomeStackNavigation';

import Favorites from 'src/pages/Favorites';
import MyAccount from 'src/pages/MyAccount';
import Notifications from 'src/pages/Notifications';
import Ranking from 'src/pages/Ranking';

export type MainDrawParamList = {
  Ranking: undefined;
  Favorites: undefined;
  Notifications: undefined;
  MyAccount: undefined;
};

export type MainDrawScreenProps<T extends keyof MainDrawParamList> =
  CompositeScreenProps<
    DrawerScreenProps<MainDrawParamList, T>,
    HomeStackScreenProps<keyof HomeStackParamList>
  >;

const Draw = createDrawerNavigator<MainDrawParamList>();

function MainDrawNavigation() {
  return (
    <Draw.Navigator
      initialRouteName="Ranking"
      screenOptions={{ headerShown: false }}>
      <Draw.Screen name="Ranking" component={Ranking} />
      <Draw.Screen name="Favorites" component={Favorites} />
      <Draw.Screen name="Notifications" component={Notifications} />
      <Draw.Screen name="MyAccount" component={MyAccount} />
    </Draw.Navigator>
  );
}

export default MainDrawNavigation;
