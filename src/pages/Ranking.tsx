import axios, { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Config from 'react-native-config';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/Ionicons';
import { useMutation, useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { Match, User } from 'src/api/DataType';
import AnimatedHeader from 'src/components/AnimatedHeader';
import RankingHorizontalView from 'src/components/RankingHorizontalView';
import { MainDrawScreenProps } from 'src/navigations/MainDrawNavigation';
import { userState } from 'src/store/recoilState';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import { ApiError } from 'src/types/api-error';
import { showToastError } from 'src/utils/toastMessage';

const width = Dimensions.get('window').width;
const topBannerHeight = 400;
const headerHeight = 60 + getStatusBarHeight(true) / 2;

function Ranking({ navigation }: MainDrawScreenProps<'Ranking'>) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useRecoilState(userState);

  const userInfoQuery = useQuery(
    ['getUserInfo'],
    () => axios.get(`${Config.API_URL}/user/current`),
    {
      onSuccess: response => {
        const userData: User = response.data.data;
        setUser(userData);
        if (!userData.profileIcon) {
          navigation.replace('ProfileIcon');
        }
      },
    },
  );

  const { data, isLoading } = useQuery(
    ['getAllMatches'],
    () => axios.get(`${Config.API_URL}/match`),
    {
      onError: error => {
        const errorResponse = (error as AxiosError).response;
        const { message } = errorResponse?.data as ApiError;
        showToastError('네트워크 오류', message);
      },
      select: response => {
        const matches: Match[] = response.data.data;
        return matches;
      },
    },
  );

  const setTitle = (matchData: any) => {
    const { matchDate, tournament, season, round, blueTeam, redTeam } =
      matchData;
    const year = matchDate.split('-')[0];

    return `${year} ${tournament} ${
      season ? season + ' ' : ''
    }${round}\n${blueTeam} vs ${redTeam}`;
  };

  if (isLoading || !data) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="menu"
          size={25}
          color={appColor.white}
          onPress={() => navigation.toggleDrawer()}
        />
        <Icon name="search" size={25} color={appColor.white} />
      </View>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('MatchDetail', {
              id: data[0].id,
              isHeart:
                data[0].user.filter(_user => _user.id === user?.id).length > 0,
              isRated:
                data[0].comment.filter(
                  _comment => _comment.user.id === user?.id,
                ).length > 0,
            })
          }
          style={styles.topBanner}>
          <Image
            source={{ uri: data[0].thumbnail }}
            style={styles.topBannerPoster}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', appColor.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.99 }}
            style={styles.topBannerBlur}></LinearGradient>
          <View style={styles.topBannerInfoContainer}>
            <Text style={styles.topBannerTitle}>{setTitle(data[0])}</Text>
            <View style={styles.topBannerRating}>
              <StarRatingDisplay
                rating={data[0].score}
                maxStars={5}
                starSize={20}
                color={appColor.rating}
                emptyColor={appColor.ratingEmpty}
                starStyle={{ marginHorizontal: 0 }}
              />
              <Text
                style={
                  styles.topBannerReview
                }>{`${data[0].comment.length}개의 평가`}</Text>
            </View>
            <View style={styles.topBannerTag}>
              {data[0].tags?.split(',').map((tag: any, index: number) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <RankingHorizontalView data={data} title="Top 10" />
        <RankingHorizontalView data={data} title="Worlds" tournament="WORLDS" />
        <RankingHorizontalView data={data} title="LCK" tournament="LCK" />
      </ScrollView>
      <AnimatedHeader
        title="MASTERPIECE"
        height={headerHeight}
        animatedValue={scrollY}
        maxHeight={topBannerHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.background,
  },
  header: {
    width: '100%',
    height: headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    paddingHorizontal: 20,
    paddingTop: getStatusBarHeight(true) / 2,
    overflow: 'hidden',
  },
  topBanner: {},
  topBannerPoster: {
    width: width,
    height: topBannerHeight,
  },
  topBannerBlur: {
    width: '100%',
    height: topBannerHeight,
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBannerTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 28,
    color: appColor.white,
    marginBottom: 10,
  },
  topBannerInfoContainer: {
    width: '100%',
    height: topBannerHeight,
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'flex-end',
    padding: 20,
    top: 0,
    left: 0,
  },
  topBannerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  topBannerReview: {
    fontFamily: AppFontFamily.bold,
    fontSize: 12,
    color: appColor.white,
    marginLeft: 10,
  },
  topBannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(255,255,255,0.6)',
    fontFamily: AppFontFamily.regular,
    fontSize: 10,
    color: appColor.white,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});

export default Ranking;
