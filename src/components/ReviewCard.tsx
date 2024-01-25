import { Image, StyleSheet, Text, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Comment, User } from 'src/api/DataType';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import Divider from './Divider';

const MOCK_USER = [
  { id: 1, nickname: 'Ahri', profile: require('src/assets/profile4.png') },
  {
    id: 2,
    nickname: 'James Sleep',
    profile: require('src/assets/profile5.png'),
  },
  {
    id: 3,
    nickname: '마라탕후루',
    profile: require('src/assets/profile7.png'),
  },
];

const MOCK_COMMENT: Comment[] = [
  {
    id: 1,
    score: 4.5,
    content: `Might as well get right to it, then. At the risk of sounding like a contrarian, I did not love this film. Do I love elements of this? Yes. `,
  },
  {
    id: 2,
    score: 4,
    content: `I had very high expectations for Christopher Nolan's latest offering as I'm a big fan of his previous work but Dunkirk is the first of his films I really don't care for. `,
  },
  {
    id: 3,
    score: 5,
    content: `Direction is okay for an otherwise quite boring movie. The only thing that saves this movie is that it's not too long, which makes it not too painful to watch.`,
  },
];

function ReviewCard({
  /* review, */ index,
  length,
}: {
  /* review: Comment, */ index: number;
  length: number;
}) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.profileContainer}>
            <Image style={styles.profile} source={MOCK_USER[index].profile} />
          </View>
          <View style={{ flex: 4 }}>
            <View style={styles.nameRow}>
              <Text style={styles.nickname}>{MOCK_USER[index].nickname}</Text>
              <StarRatingDisplay
                rating={MOCK_COMMENT[index].score}
                maxStars={5}
                color={appColor.rating}
                emptyColor={appColor.ratingEmpty}
                starSize={20}
                starStyle={{ marginHorizontal: 0 }}
              />
            </View>
            <Text style={styles.dateAgo}>1일전</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.content}>{MOCK_COMMENT[index].content}</Text>
        </View>
      </View>
      {index < length - 1 && <Divider />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomContainer: {
    marginTop: 15,
  },
  profileContainer: {
    flex: 1,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  nickname: {
    fontFamily: AppFontFamily.regular,
    fontSize: 16,
    color: appColor.white,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  dateAgo: {
    fontFamily: AppFontFamily.light,
    fontSize: 12,
    color: '#9DA3B4',
  },
  content: {
    fontFamily: AppFontFamily.light,
    fontSize: 15,
    color: '#9DA3B4',
    lineHeight: 22,
  },
});

export default ReviewCard;
