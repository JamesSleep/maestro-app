import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/Ionicons';
import ReviewCard from 'src/components/ReviewCard';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

function ReviewPage({
  navigation,
  route: { params },
}: HomeStackScreenProps<'ReviewPage'>) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back-sharp"
          size={25}
          color={appColor.white}
          style={{
            position: 'absolute',
            left: 20,
            top: getStatusBarHeight(true) / 2 + 15,
          }}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={
            styles.title
          }>{`${params.blueTeam} vs ${params.redTeam}`}</Text>
      </View>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        {params.comment.map((comment, index) => (
          <ReviewCard
            key={index}
            length={params.comment.length}
            index={index}
            comment={comment}
          />
        ))}
      </ScrollView>
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
    height: 60 + getStatusBarHeight(true) / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: getStatusBarHeight(true) / 2,
    backgroundColor: '#17171C',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    fontFamily: AppFontFamily.bold,
    fontSize: 20,
    color: appColor.white,
  },
});

export default ReviewPage;
