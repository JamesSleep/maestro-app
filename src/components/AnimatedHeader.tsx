import { useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

function AnimatedHeader({
  title,
  height,
  maxHeight,
  animatedValue,
}: {
  title: string;
  height: number;
  maxHeight: number;
  animatedValue: Animated.Value;
}) {
  const animatedHeaderOpacity = animatedValue.interpolate({
    inputRange: [0, maxHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[styles.header, { height, opacity: animatedHeaderOpacity }]}>
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
    top: 0,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowRadius: 5,
    elevation: 10,
    backgroundColor: '#17171C',
    paddingTop: getStatusBarHeight(true) / 2,
  },
  title: {
    fontFamily: AppFontFamily.bold,
    fontSize: 20,
    color: appColor.white,
  },
});

export default AnimatedHeader;
