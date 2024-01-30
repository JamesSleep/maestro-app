import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot, useResetRecoilState } from 'recoil';
import HomeStackNavigation, {
  navigationRef,
} from 'src/navigations/HomeStackNavigation';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <HomeStackNavigation />
          <Toast />
        </NavigationContainer>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
