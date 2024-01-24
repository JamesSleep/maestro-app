import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import RankingHorizontalView from 'src/components/RankingHorizontalView';
import { MainDrawScreenProps } from 'src/navigations/MainDrawNavigation';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import { ApiError } from 'src/types/api-error';
import { showToastError } from 'src/utils/toastMessage';

const width = Dimensions.get('window').width;
const topBannerHeight = 400;

function Ranking({ navigation }: MainDrawScreenProps<'Ranking'>) {
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
        const matches = response.data.data;
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

  if (isLoading) {
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
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBanner}>
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
                rating={4}
                maxStars={5}
                starSize={20}
                color={appColor.rating}
                emptyColor={appColor.ratingEmpty}
                starStyle={{ marginHorizontal: 0 }}
              />
              <Text style={styles.topBannerReview}>189개의 리뷰</Text>
            </View>
            <View style={styles.topBannerTag}>
              <Text style={styles.tag}>SILVER SCRAPS</Text>
              <Text style={styles.tag}>UNDERDOG</Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', height: topBannerHeight }} />
        <RankingHorizontalView data={data} title="모든 경기" />
        <RankingHorizontalView data={data} title="Worlds" tournament="Worlds" />
        <RankingHorizontalView data={data} title="LCK" tournament="LCK" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.background,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    position: 'absolute',
    zIndex: 100,
    top: 0,
    paddingHorizontal: 20,
  },
  topBanner: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
  },
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
    fontSize: 30,
    color: appColor.white,
    textShadowColor: '#c1c1c1',
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 2,
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
    borderWidth: 0.3,
    borderRadius: 5,
    borderColor: '#fff',
    fontFamily: AppFontFamily.regular,
    fontSize: 12,
    color: appColor.white,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});

export default Ranking;
