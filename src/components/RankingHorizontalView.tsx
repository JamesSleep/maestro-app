import { ReactElement } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import RankingCard from './RankingCard';
import { Match } from 'src/api/DataType';

function RankingHorizontalView({
  title,
  tournament,
  data,
}: {
  title: string;
  tournament?: 'WORLDS' | 'LCK';
  data: Match[];
}) {
  return (
    <>
      <View style={styles.scrollHeader}>
        <Text style={styles.scrollHeaderTitle}>{title}</Text>
        <Pressable>
          <Text style={styles.scrollHeaderBtn}>전체보기</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}>
        {!!tournament
          ? data.map(
              (match: any) =>
                tournament === match.tournament && (
                  <RankingCard key={match.id} match={match} />
                ),
            )
          : data.map((match: any) => (
              <RankingCard key={match.id} match={match} />
            ))}
      </ScrollView>
      <View style={{ height: 30 }} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  scrollHeaderTitle: {
    fontFamily: AppFontFamily.bold,
    fontSize: 22,
    color: appColor.white,
  },
  scrollHeaderBtn: {
    fontFamily: AppFontFamily.regular,
    fontSize: 14,
    color: appColor.white,
  },
});

export default RankingHorizontalView;
