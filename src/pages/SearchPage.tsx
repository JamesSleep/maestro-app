import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { getStatusBarHeight } from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import { Match, Player } from 'src/api/DataType';
import { fetchApi } from 'src/api/fetchApi';
import Divider from 'src/components/Divider';
import RankingHorizontalView from 'src/components/RankingHorizontalView';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

function SearchPage({ navigation }: HomeStackScreenProps<'SearchPage'>) {
  const [searchText, setSearchText] = useState('');

  const { data, isLoading } = useQuery(
    ['getRecent'],
    () => fetchApi.get(`/recent`),
    {
      select: resposne => {
        const data = resposne.data.data;
        const matches: Match[] = data.map(
          (data: any, index: number) => data.match,
        );
        return [...new Map(matches.map(m => [m.id, m])).values()];
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const {
    data: searchResult,
    isLoading: searchIsLoading,
    refetch,
  } = useQuery(
    ['getSearchMatch', searchText],
    () => fetchApi.get(`/match/search/${searchText}`),
    {
      select: response => {
        if (response.data.data) {
          const { matches, players }: { matches: Match[]; players: Player[] } =
            response.data.data;
          return { matches, players };
        }
        return undefined;
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const setTitle = (matchData: any) => {
    const { matchDate, tournament, season, round, blueTeam, redTeam } =
      matchData;
    const year = matchDate.split('-')[0];

    return `${year} ${tournament} ${
      season ? season + ' ' : ''
    }${round} ${blueTeam} vs ${redTeam}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back-sharp"
          size={20}
          color={appColor.white}
          onPress={() => navigation.goBack()}
        />
        {/* <Text style={styles.headerTitle}>검색</Text> */}
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
          }}
          placeholderTextColor="rgba(72, 72, 85, 0.7)"
          placeholder="대회, 팀, 선수를 검색해보세요..."
          returnKeyType="search"
          clearButtonMode="while-editing"
          onSubmitEditing={() => {}}
        />
      </View>
      <Divider />
      {data && data.length > 0 && searchText.length < 1 && (
        <View style={styles.recentContainer}>
          <Text style={styles.columnTitle}>최근 본 경기</Text>
          <ScrollView
            horizontal
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}>
            {data.map(match => (
              <Pressable
                key={match.id}
                style={{ width: 100, marginHorizontal: 10 }}>
                <FastImage
                  style={{ width: 100, height: 140, borderRadius: 10 }}
                  source={{ uri: match.poster }}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      {searchResult && (
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20 }}>
          {searchResult.matches.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 30 }}>
              <Text style={styles.columnTitle}>경기</Text>
              {searchResult.matches.map(match => (
                <Pressable key={match.id} style={{ marginVertical: 25 }}>
                  <Text style={styles.searchText}>{setTitle(match)}</Text>
                </Pressable>
              ))}
            </View>
          )}
          {searchResult.players.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 30 }}>
              <Text style={styles.columnTitle}>선수</Text>
              {searchResult.players.map(player => (
                <Pressable key={player.id} style={{ marginVertical: 25 }}>
                  <Text
                    style={
                      styles.searchText
                    }>{`${player.name} (${player.realName})`}</Text>
                </Pressable>
              ))}
            </View>
          )}
          {searchResult.matches.length < 1 &&
            searchResult.players.length < 1 && (
              <View style={styles.noData}>
                <Text style={styles.noDataText}>
                  검색결과가 존재하지 않습니다.
                </Text>
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
    paddingHorizontal: 20,
    paddingTop: getStatusBarHeight(true) / 2 + 20,
  },
  headerTitle: {
    fontFamily: AppFontFamily.regular,
    fontSize: 15,
    color: 'rgba(152, 152, 175, 1)',
    marginTop: 20,
  },
  input: {
    fontFamily: AppFontFamily.bold,
    fontSize: 23,
    color: appColor.white,
    marginVertical: 10,
  },
  recentContainer: {
    marginVertical: 20,
  },
  columnTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 24,
    color: appColor.white,
    paddingLeft: 20,
    marginBottom: 20,
  },
  searchText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 18,
    color: appColor.white,
    paddingLeft: 20,
  },
  noData: {
    paddingLeft: 20,
  },
  noDataText: {
    fontFamily: AppFontFamily.regular,
    fontSize: 20,
    color: appColor.white,
  },
});

export default SearchPage;
