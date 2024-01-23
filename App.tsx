import { NavigationContainer } from '@react-navigation/native';
import AppInner from './AppInner';
import Toast from 'react-native-toast-message';

function App() {
  return (
    <NavigationContainer>
      <AppInner />
      <Toast />
    </NavigationContainer>
  );
}

export default App;
