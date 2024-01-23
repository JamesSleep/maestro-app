import Toast from 'react-native-toast-message';
import { AppFontFamily } from '../theme/font';

export const showToastError = (
  title: string,
  message: string | string[] | undefined,
) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message ? message.toString().split(',')[0] : '관리자 문의',
    text1Style: { fontFamily: AppFontFamily.bold, fontSize: 12 },
    text2Style: { fontFamily: AppFontFamily.regular, fontSize: 14 },
  });
};
