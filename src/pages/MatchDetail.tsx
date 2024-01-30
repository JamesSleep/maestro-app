import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,
  Modal,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-safearea-height';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/Ionicons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { Match } from 'src/api/DataType';
import { fetchApi } from 'src/api/fetchApi';
import AnimatedHeader from 'src/components/AnimatedHeader';
import CommentModal from 'src/components/CommentModal';
import Divider from 'src/components/Divider';
import GalleryModal from 'src/components/GalleryModal';
import PlayerCard from 'src/components/PlayerCard';
import ReviewCard from 'src/components/ReviewCard';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { userState } from 'src/store/recoilState';
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
  const queryClient = useQueryClient();
  const user = useRecoilValue(userState);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isRated, setIsRated] = useState(params.isRated);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [isHeart, setIsHeart] = useState(params.isHeart);
  const [visible, setVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [commentVisible, setCommentVisible] = useState(false);

  const { data, isLoading } = useQuery(
    ['getOneMatch', params.id],
    () => fetchApi.get(`/match/${params.id}`),
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

  const { mutate, isLoading: isMuteLoading } = useMutation(
    ['likeMatch'],
    (query: { matchId: number; userId?: number }) =>
      fetchApi.post(`/match/like`, query),
    {
      onSuccess: response => {
        queryClient.invalidateQueries(['getOneMatch', params.id]);
        queryClient.invalidateQueries(['getAllMatches']);
      },
    },
  );

  const { mutate: reviewMutate, isLoading: isReviewMuteLoading } = useMutation(
    ['reviewUpdate'],
    (query: {
      matchId: number;
      userId: number;
      score?: number;
      content?: string;
    }) => fetchApi.post(`/comment`, query),
    {
      onSuccess: response => {
        queryClient.invalidateQueries(['getOneMatch', params.id]);
        queryClient.invalidateQueries(['getAllMatches']);
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

  const setMatchDate = (matchDate: string) => {
    const date = new Date(matchDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${year}년 ${month + 1}월 ${day}일`;
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
        <Icon
          name={isHeart ? 'heart' : 'heart-outline'}
          size={25}
          color={isHeart ? appColor.rating : appColor.white}
          onPress={() => {
            if (!isMuteLoading) {
              setIsHeart(prev => !prev);
              mutate({ matchId: params.id, userId: user?.id });
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
              data.thumbnail
                ? { uri: data.thumbnail }
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
            <Text style={styles.thumbnailTitle}>{setTitle(data)}</Text>
            <View style={styles.thumbnailTag}>
              {data.tags?.split(',').map((tag: any, index: number) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.matchInfoContainer}>
          {!isRating ? (
            <>
              <View
                style={[
                  styles.matchInfoBlock,
                  { height: '100%', justifyContent: 'center' },
                ]}>
                <Text style={styles.matchScore}>{`${
                  data.blueTeamScore > data.redTeamScore
                    ? data.blueTeamScore
                    : data.redTeamScore
                } : ${
                  data.blueTeamScore < data.redTeamScore
                    ? data.blueTeamScore
                    : data.redTeamScore
                }`}</Text>
                <Text style={styles.matchResult}>
                  {data.blueTeamScore > data.redTeamScore
                    ? `${data.blueTeam}`
                    : `${data.redTeam}`}
                </Text>
              </View>
              <View style={[styles.matchInfoBlock]}>
                <StarRatingDisplay
                  rating={1}
                  maxStars={1}
                  starSize={30}
                  color={appColor.rating}
                  emptyColor={appColor.ratingEmpty}
                  starStyle={{ marginHorizontal: 0 }}
                />
                <Text style={styles.rateScore}>
                  {!data.score ? '0.0' : data.score.toFixed(1)}
                  <Text style={styles.rateMaxScore}>{`/5`}</Text>
                </Text>
                <Text
                  style={
                    styles.reviewText
                  }>{`${data.comment.length}개의 평가`}</Text>
              </View>
              <Pressable
                onPress={() => setIsRating(prev => !prev)}
                style={[styles.matchInfoBlock]}>
                <StarRatingDisplay
                  rating={
                    data.comment.filter(comment => comment.user.id === user?.id)
                      .length > 0
                      ? 1
                      : 0
                  }
                  maxStars={1}
                  starSize={30}
                  color={appColor.rating}
                  emptyColor={appColor.ratingEmpty}
                  starStyle={{ marginHorizontal: 0 }}
                />
                <Text style={styles.ratingText}>
                  {data.comment.filter(comment => comment.user.id === user?.id)
                    .length > 0
                    ? data.comment
                        .filter(comment => comment.user.id === user?.id)[0]
                        .score.toFixed(1)
                    : '평가하기'}
                </Text>
                {data.comment.filter(comment => comment.user.id === user?.id)
                  .length > 0 && (
                  <Text style={styles.reviewText}>나의 평가</Text>
                )}
              </Pressable>
            </>
          ) : (
            <View
              style={[
                styles.matchInfoBlock,
                { height: '100%', justifyContent: 'center' },
              ]}>
              <StarRating
                rating={rating}
                onChange={rate => {
                  setRating(rate);
                }}
                maxStars={5}
                color={appColor.rating}
                emptyColor={appColor.ratingEmpty}
                starSize={40}
                starStyle={{ marginHorizontal: 0 }}
                onRatingEnd={() => {
                  setIsRated(prev => !prev);
                  setIsRating(prev => !prev);
                  reviewMutate({
                    matchId: params.id,
                    userId: user?.id || 0,
                    score: rating,
                  });
                }}
              />
            </View>
          )}
        </View>
        <Divider />
        <View style={styles.posterContainer}>
          <FastImage
            source={
              data.poster
                ? { uri: data.poster }
                : require('src/assets/world_empty.jpg')
            }
            style={styles.poster}
          />
          <View>
            <View style={styles.matchRow}>
              <Text style={styles.infoKey}>대회: </Text>
              <Text style={styles.infoValue}>{`${
                data.matchDate.split('-')[0]
              } ${data.tournament} ${data.season ? data.season : ''}`}</Text>
            </View>
            <View style={styles.matchRow}>
              <Text style={styles.infoKey}>라운드: </Text>
              <Text style={styles.infoValue}>{data.round}</Text>
            </View>
            <View style={styles.matchRow}>
              <Text style={styles.infoKey}>대진: </Text>
              <Text
                style={
                  styles.infoValue
                }>{`${data.blueTeam} vs ${data.redTeam}`}</Text>
            </View>
            <View style={styles.matchRow}>
              <Text style={styles.infoKey}>경기날짜: </Text>
              <Text style={styles.infoValue}>
                {setMatchDate(data.matchDate)}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.potgContainer}>
          <Text style={[styles.columnTitle, { marginBottom: 0 }]}>
            Play of The Game
          </Text>
          <FastImage
            style={{ width: '100%', height: 240 }}
            source={{
              uri: data.potg,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <Divider />
        <View style={styles.highlightContainer}>
          <Text style={styles.columnTitle}>하이라이트</Text>
          <YoutubeIframe height={200} videoId={data.videoLink} />
        </View>
        <Divider />
        <View style={styles.lineupContainer}>
          <Text style={[styles.columnTitle, { paddingLeft: 20 }]}>라인업</Text>
          <ScrollView
            horizontal
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}>
            {data.players.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </ScrollView>
        </View>
        {data.gallery.length > 0 && (
          <>
            <Divider />
            <View style={styles.lineupContainer}>
              <Text style={[styles.columnTitle, { paddingLeft: 20 }]}>
                갤러리
              </Text>
              <ScrollView
                horizontal
                bounces={false}
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}>
                {data.gallery.map((photo, index) => (
                  <Pressable
                    key={photo.id}
                    onPress={() => {
                      setVisible(true);
                      setImageIndex(index);
                    }}
                    style={{ marginHorizontal: 10 }}>
                    <FastImage
                      style={{ width: 150, height: 100, borderRadius: 10 }}
                      source={{ uri: photo.uri }}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        {data.comment.filter(comment => !!comment.content).length > 0 && (
          <>
            <Divider />
            <View style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Text style={styles.columnTitle}>코멘트</Text>
                <Text style={styles.columnBtnText}>전체보기</Text>
              </View>
              {data.comment.map((comment, index) => (
                <ReviewCard
                  key={index}
                  length={data.comment.length}
                  index={index}
                  comment={comment}
                />
              ))}
            </View>
          </>
        )}
        <Pressable onPress={() => setCommentVisible(true)}>
          <LinearGradient
            useAngle
            angle={120}
            angleCenter={{ x: 0.5, y: 1 }}
            colors={['#FD8F61', '#F84B62', '#74398A']}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.1, 0.5, 1]}
            style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>코멘트 작성</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
      <GalleryModal
        initialIndex={imageIndex}
        item={data.gallery.map(photho => photho.uri)}
        onClose={() => setVisible(false)}
        visible={visible}
      />
      <CommentModal
        visible={commentVisible}
        onClose={() => setCommentVisible(false)}
        matchId={params.id}
      />
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
  thumbnailTag: {
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
  matchInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 20,
    height: 120,
  },
  matchInfoBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchScore: {
    color: '#86c994',
    fontFamily: AppFontFamily.bold,
    fontSize: 20,
    marginBottom: 10,
  },
  matchResult: {
    fontFamily: AppFontFamily.regular,
    fontSize: 17,
    color: appColor.white,
  },
  rateScore: {
    fontFamily: AppFontFamily.bold,
    fontSize: 21,
    color: appColor.white,
    marginVertical: 3,
  },
  rateMaxScore: {
    fontFamily: AppFontFamily.bold,
    fontSize: 14,
    color: appColor.white,
  },
  reviewText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  ratingText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 16,
    color: appColor.white,
    marginVertical: 5,
  },
  posterContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  poster: {
    width: 120,
    height: 200,
    borderRadius: 10,
    marginRight: 20,
  },
  matchRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoKey: {
    fontFamily: AppFontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  infoValue: {
    fontFamily: AppFontFamily.bold,
    fontSize: 13,
    color: appColor.white,
  },
  potgContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  highlightContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  columnTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 22,
    color: appColor.white,
    marginBottom: 20,
  },
  lineupContainer: {
    paddingVertical: 30,
  },
  reviewContainer: {
    paddingVertical: 30,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  columnBtnText: {
    fontFamily: AppFontFamily.light,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  reviewButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  reviewButtonText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 17,
    color: appColor.white,
  },
});

export default MatchDetail;
