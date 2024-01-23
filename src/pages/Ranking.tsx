import { Pressable, Text, View } from 'react-native';
import { MainDrawScreenProps } from 'src/navigations/MainDrawNavigation';

function Ranking({ navigation }: MainDrawScreenProps<'Ranking'>) {
  return (
    <View>
      <Text>Ranking</Text>
      <Pressable onPress={() => navigation.navigate('Match')}>
        <Text style={{ color: 'black' }}>Match</Text>
      </Pressable>
    </View>
  );
}

export default Ranking;
