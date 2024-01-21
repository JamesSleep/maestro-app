import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/pages/SignUp';
import SignIn from './src/pages/SignIn';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
}

export default AppInner;
