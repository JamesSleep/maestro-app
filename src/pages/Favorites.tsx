import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQueries, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { Match, Player } from 'src/api/DataType';
import { fetchApi } from 'src/api/fetchApi';
import PlayerCard from 'src/components/PlayerCard';
import RankingHorizontalView from 'src/components/RankingHorizontalView';
import { MainDrawScreenProps } from 'src/navigations/MainDrawNavigation';
import { userState } from 'src/store/recoilState';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

const width = Dimensions.get('window').width;
const headerHeight = 60 + getStatusBarHeight(true) / 2;

function Favorites({ navigation }: MainDrawScreenProps<'Favorites'>) {
  const user = useRecoilValue(userState);
  const [
    { data: favoriteMatch, isLoading: isLoadingMatch },
    { data: favoritePlayer, isLoading: isLoadingPlayer },
  ] = useQueries([
    {
      queryKey: ['getAllMatchesFavorite'],
      queryFn: () => fetchApi.get(`/match`),
      select: (response: any) => {
        const matches: Match[] = response.data.data;
        return matches.filter(
          match => match.user.filter(_user => _user.id === user?.id).length > 0,
        );
      },
    },
    {
      queryKey: ['getAllPlayersFavorite'],
      queryFn: () => fetchApi.get(`/player`),
      select: (response: any) => {
        const players: Player[] = response.data.data;
        return players.filter(
          player =>
            player.user.filter(_user => _user.id === user?.id).length > 0,
        );
      },
    },
  ]);

  if (!favoriteMatch || !favoritePlayer) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.toggleDrawer()}
          style={{
            width: 70,
            height: 70,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}>
          <Icon name="menu" size={25} color={appColor.white} />
        </Pressable>
        <Text style={styles.title}>컬렉션</Text>
        <Pressable
          onPress={() => navigation.toggleDrawer()}
          style={{
            width: 70,
            height: 70,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 20,
          }}>
          <Icon name="search" size={25} color={appColor.white} />
        </Pressable>
      </View>
      {favoriteMatch.length < 1 && favoritePlayer.length < 1 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="cloud-offline-outline" color={appColor.white} size={50} />
          <Text
            style={{
              fontFamily: AppFontFamily.regular,
              fontSize: 15,
              color: appColor.white,
              marginTop: 10,
            }}>
            결과가 없어요.
          </Text>
        </View>
      ) : (
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}>
          {favoriteMatch.length > 0 && (
            <RankingHorizontalView data={favoriteMatch} title="경기" hideAll />
          )}
          {favoritePlayer.length > 0 && (
            <View style={styles.lineupContainer}>
              <Text style={[styles.columnTitle, { paddingLeft: 20 }]}>
                선수
              </Text>
              <ScrollView
                horizontal
                bounces={false}
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}>
                {favoritePlayer.map(player => (
                  <Pressable
                    key={player.id}
                    onPress={() =>
                      navigation.navigate('PlayerPage', {
                        player,
                        isHeart:
                          player.user.filter(_user => _user.id === user?.id)
                            .length > 0,
                        matchId: 0,
                      })
                    }>
                    <PlayerCard player={player} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
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
    height: headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal: 20,
    paddingTop: getStatusBarHeight(true) / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowRadius: 5,
    elevation: 10,
    backgroundColor: '#17171C',
  },
  title: {
    fontFamily: AppFontFamily.bold,
    fontSize: 20,
    color: appColor.white,
  },
  lineupContainer: {
    paddingVertical: 30,
  },
  columnTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 22,
    color: appColor.white,
    marginBottom: 20,
  },
});

export default Favorites;
