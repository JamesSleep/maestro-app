import { useCallback, useState } from 'react';
import { Alert, Button, Pressable, Text, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import YoutubePlayer, { PLAYER_STATES } from 'react-native-youtube-iframe';
import { MainDrawScreenProps } from 'src/navigations/MainDrawNavigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

function Ranking({ navigation }: MainDrawScreenProps<'Ranking'>) {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: PLAYER_STATES) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  return (
    <View>
      <Text>Ranking</Text>
      <Pressable onPress={() => navigation.navigate('Match')}>
        <Text style={{ color: 'black' }}>Match</Text>
      </Pressable>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={'b56apBhNYkM'}
        onChangeState={onStateChange}
      />
      <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
      <Rating
        type="heart"
        ratingCount={3}
        imageSize={60}
        showRating
        //onFinishRating={this.ratingCompleted}
      />
      <Icon name="comments" size={20} color="#900" />
    </View>
  );
}

export default Ranking;
