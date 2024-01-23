import { NavigationContainer } from '@react-navigation/native';
import AppInner from './AppInner';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppInner />
        <Toast />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
