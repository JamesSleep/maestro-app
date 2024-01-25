import axios, { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import { Match } from 'src/api/DataType';
import AnimatedHeader from 'src/components/AnimatedHeader';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import { ApiError } from 'src/types/api-error';
import { showToastError } from 'src/utils/toastMessage';

const width = Dimensions.get('window').width;
const thumbnailHeight = 400;
const headerHeight = 60 + getStatusBarHeight(true) / 2;

function MatchDetail({
  navigation,
  route: { params },
}: HomeStackScreenProps<'MatchDetail'>) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data, isLoading } = useQuery(
    ['getOneMatch'],
    () => axios.get(`${Config.API_URL}/match/${params.id}`),
    {
      onError: error => {
        const errorResponse = (error as AxiosError).response;
        const { message } = errorResponse?.data as ApiError;
        showToastError('네트워크 오류', message);
      },
      select: response => {
        const match: Match = response.data.data;
        return match;
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

  if (isLoading || !data) return <></>;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Icon
          name="arrow-back-sharp"
          size={25}
          color={appColor.white}
          onPress={() => navigation.goBack()}
        />
        <Icon name="heart-outline" size={25} color={appColor.white} />
      </View>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: data.thumbnail }} style={styles.thumbnail} />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', appColor.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.99 }}
            style={styles.thumbnailBlur}
          />
          <View style={styles.thumbnailInfoContainer}>
            <Text style={styles.topBannerTitle}>{setTitle(data)}</Text>
            <View style={styles.topBannerTag}>
              {data.tags?.split(',').map((tag: any, index: number) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={{ width: '100%', height: 1000 }}></View>
      </ScrollView>
      <AnimatedHeader
        height={headerHeight}
        title={`${data.blueTeam} vs ${data.redTeam}`}
        maxHeight={thumbnailHeight}
        animatedValue={scrollY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.background,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    paddingHorizontal: 20,
    overflow: 'hidden',
    paddingTop: getStatusBarHeight(true) / 2,
  },
  thumbnailContainer: {},
  thumbnail: {
    width: width,
    height: thumbnailHeight,
  },
  thumbnailBlur: {
    width: '100%',
    height: thumbnailHeight,
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBannerTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 27,
    color: appColor.white,
    textShadowColor: '#c1c1c1',
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  thumbnailInfoContainer: {
    width: '100%',
    height: thumbnailHeight,
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

export default MatchDetail;
