import { AxiosError } from 'axios';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { fetchApi } from 'src/api/fetchApi';
import { PROFILE_ARRAY } from 'src/constants/profileArray';
import { HomeStackScreenProps } from 'src/navigations/HomeStackNavigation';
import { userState } from 'src/store/recoilState';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

const width = Dimensions.get('window').width;

function ProfileIcon({ navigation }: HomeStackScreenProps<'ProfileIcon'>) {
  const queryClient = useQueryClient();
  const user = useRecoilValue(userState);
  const [selected, setSelected] = useState<number | null>(null);

  const { mutate } = useMutation(
    ['updateProfile'],
    async () =>
      await fetchApi.patch(`/user/${user?.id}`, {
        profileIcon: selected,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getUserInfo'] });
        navigation.replace('Main');
      },
      onError: error => {
        const errorResponse = (error as AxiosError).response;
      },
    },
  );

  return (
    <View style={styles.container}>
      <Text style={styles.information}>
        {`프로필 아이콘을 선택해주세요.\n프로필 아이콘은 언제든지 변경할 수 있어요.`}
      </Text>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {PROFILE_ARRAY.map((profile, index) => (
            <Pressable
              key={index}
              style={{
                marginBottom: 30,
                borderWidth: 5,
                borderColor: '#17171C',
                borderRadius: 200,
              }}
              onPress={() => setSelected(index)}>
              <View
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderRadius: 200,
                  position: 'absolute',
                  zIndex: 100,
                  top: 0,
                  backgroundColor:
                    selected === index ? 'rgba(46,76,244, 0.8)' : 'transparent',
                }}
              />
              <Image style={styles.icon} source={profile} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {selected !== null && (
        <Pressable onPress={() => mutate()}>
          <LinearGradient
            useAngle
            angle={120}
            angleCenter={{ x: 0.5, y: 1 }}
            colors={['#FD8F61', '#F84B62', '#74398A']}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.1, 0.5, 1]}
            style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>선택 완료</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.background,
    paddingTop: getStatusBarHeight(true) / 2 + 30,
  },
  information: {
    paddingHorizontal: 20,
    fontFamily: AppFontFamily.regular,
    fontSize: 17,
    color: appColor.white,
    lineHeight: 22,
    marginBottom: 20,
  },
  icon: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 200,
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

export default ProfileIcon;
