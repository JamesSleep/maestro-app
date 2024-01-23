import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

type Component = {
  style?: StyleProp<ViewStyle>;
  children: JSX.Element[] | JSX.Element;
  bounce?: boolean;
  scrollEnabled?: boolean;
};

const DismissKeyboardView: React.FC<Component> = ({ children, ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
      stickyHeaderHiddenOnScroll={false}
      bounces={false}
      {...props}
      style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
