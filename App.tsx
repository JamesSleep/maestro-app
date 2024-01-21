import { NavigationContainer } from '@react-navigation/native';
import AppInner from './AppInner';
import { SafeAreaView } from 'react-native';

function App() {
  return (
    <NavigationContainer>
      <AppInner />
    </NavigationContainer>
  );
}

export default App;
