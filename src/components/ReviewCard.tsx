import { Image, StyleSheet, Text, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Comment, User } from 'src/api/DataType';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import Divider from './Divider';
import { useRecoilValue } from 'recoil';
import { userState } from 'src/store/recoilState';
import ProfileIcon from 'src/pages/ProfileIcon';
import { PROFILE_ARRAY } from 'src/constants/profileArray';

function ReviewCard({
  index,
  length,
  comment,
}: {
  index: number;
  length: number;
  comment: Comment;
}) {
  const user = useRecoilValue(userState);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.profileContainer}>
            <Image
              style={styles.profile}
              source={PROFILE_ARRAY[comment.user?.profileIcon || 0]}
            />
          </View>
          <View style={{ flex: 4 }}>
            <View style={styles.nameRow}>
              <Text style={styles.nickname}>{comment.user.nickname}</Text>
              {comment.score > 0 && (
                <StarRatingDisplay
                  rating={comment.score}
                  maxStars={5}
                  color={appColor.rating}
                  emptyColor={appColor.ratingEmpty}
                  starSize={20}
                  starStyle={{ marginHorizontal: 0 }}
                />
              )}
            </View>
            <Text style={styles.dateAgo}>1일전</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.content}>{comment.content}</Text>
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
