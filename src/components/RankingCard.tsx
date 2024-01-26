import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useRecoilValue } from 'recoil';
import { Match } from 'src/api/DataType';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { userState } from 'src/store/recoilState';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

function RankingCard({ match }: { match: Match }) {
  const user = useRecoilValue(userState);
  const navigation =
    useNavigation<HomeStackScreenProps<'Main'>['navigation']>();
  const setTitle = (matchData: any) => {
    const { matchDate, tournament, season, round, blueTeam, redTeam } =
      matchData;
    const year = matchDate.split('-')[0];

    return `${year} ${tournament} ${
      season ? season + ' ' : ''
    }${round}\n${blueTeam} vs ${redTeam}`;
  };

  return (
    <TouchableWithoutFeedback
      key={match.id}
      style={styles.match}
      onPress={() =>
        navigation.navigate('MatchDetail', {
          id: match.id,
          isHeart: match.user.filter(_user => _user.id === user?.id).length > 0,
          isRated:
            match.comment.filter(_comment => _comment.user.id === user?.id)
              .length > 0,
        })
      }>
      <View style={styles.posterBlur}></View>
      <Image
        source={
          match.poster
            ? { uri: match.poster }
            : require('src/assets/world_empty.jpg')
        }
        style={styles.poster}
      />
      <Text style={styles.matchTitle}>{setTitle(match)}</Text>
      <View style={styles.matchRating}>
        <StarRatingDisplay
          rating={match.score}
          maxStars={5}
          starSize={12}
          color={appColor.white}
          emptyColor={appColor.ratingEmpty}
          starStyle={{ marginHorizontal: 0 }}
        />
        <Text
          style={styles.matchReview}>{`${match.comment.length}개의 평가`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  match: {
    marginHorizontal: 10,
  },
  poster: {
    width: 250,
    height: 350,
    borderRadius: 10,
    marginBottom: 10,
  },
  posterBlur: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    width: 250,
    height: 350,
    zIndex: 1,
    top: 0,
    justifyContent: 'flex-end',
    padding: 10,
  },
  matchTitle: {
    fontFamily: AppFontFamily.regular,
    fontSize: 17,
    color: appColor.white,
    marginBottom: 5,
    textShadowColor: '#c1c1c1',
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 1,
  },
  matchRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchReview: {
    fontFamily: AppFontFamily.regular,
    fontSize: 9,
    color: appColor.white,
    marginLeft: 10,
  },
});

export default RankingCard;
