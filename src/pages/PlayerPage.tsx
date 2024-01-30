import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-safearea-height';
import AnimatedHeader from 'src/components/AnimatedHeader';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { appColor } from 'src/theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { AppFontFamily } from 'src/theme/font';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Divider from 'src/components/Divider';
import { useMutation, useQueryClient } from 'react-query';
import { fetchApi } from 'src/api/fetchApi';
import { useRecoilValue } from 'recoil';
import { userState } from 'src/store/recoilState';

const width = Dimensions.get('window').width;
const thumbnailHeight = 400;
const headerHeight = 60 + getStatusBarHeight(true) / 2;

function PlayerPage({
  navigation,
  route: {
    params: { player, matchId, isHeart },
  },
}: HomeStackScreenProps<'PlayerPage'>) {
  const queryClient = useQueryClient();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isHearted, setIsHeart] = useState(isHeart);
  const user = useRecoilValue(userState);

  const { mutate, isLoading: isMuteLoading } = useMutation(
    ['likePlayer'],
    (query: { playerId: number; userId?: number }) =>
      fetchApi.post(`/player/like`, query),
    {
      onSuccess: response => {
        queryClient.invalidateQueries(['getOneMatch', matchId]);
        queryClient.invalidateQueries(['getAllMatches']);
      },
    },
  );

  const setDateFormat = (date: string) => {
    const _date = new Date(date);
    const year = _date.getFullYear();
    const month = _date.getMonth() + 1;
    const day = _date.getDate();

    return `${year}년 ${month}월 ${day}일`;
  };

  const setDateHistory = (date: string) => {
    const _date = date.split('.');

    if (!date) return '';

    return `${_date[0]}.${_date[1]}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Icon
          name="arrow-back-sharp"
          size={25}
          color={appColor.white}
          onPress={() => navigation.goBack()}
        />
        <Icon
          name={isHearted ? 'heart' : 'heart-outline'}
          size={25}
          color={isHearted ? appColor.rating : appColor.white}
          onPress={() => {
            if (!isMuteLoading) {
              setIsHeart(prev => !prev);
              mutate({ playerId: player.id, userId: user?.id });
            }
          }}
        />
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
        <View style={styles.thumbnailContainer}>
          <FastImage
            source={
              player.mainProfile
                ? { uri: player.mainProfile }
                : require('src/assets/world_empty.jpg')
            }
            style={styles.thumbnail}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', appColor.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.99 }}
            style={styles.thumbnailBlur}
          />
          <View style={styles.thumbnailInfoContainer}>
            <Text
              style={
                styles.thumbnailTitle
              }>{`${player.name}, ${player.realName}`}</Text>
            <Text style={styles.thumbnailBirth}>
              {setDateFormat(player.birth)}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.historyContainer}>
          <Text style={styles.columnTitle}>선수 경력</Text>
          {player.history.map((history, index) => (
            <View key={index} style={styles.historyRow}>
              <Text style={styles.historyText}>{`${setDateHistory(
                history.start,
              )} ~ `}</Text>
              <Text
                style={[
                  styles.historyText,
                  {
                    color: history.end
                      ? 'rgba(152, 152, 175, 1)'
                      : appColor.background,
                  },
                ]}>
                {history.end ? setDateHistory(history.end) : '0000.00'}
              </Text>
              <Text style={styles.historyText}>{`   ${history.team}`}</Text>
            </View>
          ))}
        </View>
        <Divider />
        <View style={styles.historyContainer}>
          <Text style={styles.columnTitle}>우승 경력</Text>
          {player.winning.map((winning, index) => (
            <View key={index} style={styles.historyRow}>
              <Text style={styles.historyText}>{winning.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <AnimatedHeader
        height={headerHeight}
        title={player.name}
        maxHeight={200}
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
  thumbnailContainer: {
    marginBottom: 10,
  },
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
  thumbnailTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 27,
    color: appColor.white,
    marginBottom: 15,
  },
  thumbnailBirth: {
    fontFamily: AppFontFamily.regular,
    fontSize: 18,
    color: appColor.white,
    marginBottom: 15,
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
  historyContainer: {
    padding: 20,
  },
  columnTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 22,
    color: appColor.white,
    marginBottom: 20,
  },
  historyRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  historyText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 15,
    color: 'rgba(152, 152, 175, 1)',
  },
});

export default PlayerPage;
