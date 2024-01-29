import { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';
import DismissKeyboardView from './DismissKeyboardView';
import { getStatusBarHeight } from 'react-native-safearea-height';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Config from 'react-native-config';
import { useRecoilValue } from 'recoil';
import { userState } from 'src/store/recoilState';

function CommentModal({
  visible,
  onClose,
  matchId,
}: {
  visible: boolean;
  onClose: any;
  matchId: number;
}) {
  const [comment, setComment] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const queryClient = useQueryClient();
  const user = useRecoilValue(userState);

  const { mutate, isLoading } = useMutation(
    ['commentUpdate'],
    (query: {
      matchId: number;
      userId?: number;
      score?: number;
      content?: string;
    }) => axios.post(`${Config.API_URL}/comment`, query),
    {
      onSuccess: response => {
        queryClient.invalidateQueries(['getOneMatch', matchId]);
        queryClient.invalidateQueries(['getAllMatches']);
      },
    },
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text style={styles.text}>취소</Text>
          </Pressable>
          <Text
            style={[
              styles.text,
              { fontSize: 17, fontFamily: AppFontFamily.bold },
            ]}>
            코멘트 작성
          </Text>
          <Pressable
            onPress={() => {
              if (comment.length < 1) return;
              mutate({ matchId, userId: user?.id, content: comment });
              onClose();
            }}>
            <Text
              style={[
                styles.text,
                {
                  color:
                    comment.length > 0
                      ? appColor.white
                      : 'rgba(72, 72, 85, 0.7)',
                },
              ]}>
              확인
            </Text>
          </Pressable>
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholderTextColor="rgba(72, 72, 85, 0.7)"
          placeholder="경기 감상평을 자유롭게 적어주세요."
          value={comment}
          onChangeText={setComment}
          autoFocus
          onLayout={() => inputRef.current?.focus()}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(72, 72, 85, 0.3)',
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 20 + getStatusBarHeight(true) / 2,
  },
  text: {
    fontFamily: AppFontFamily.regular,
    fontSize: 16,
    color: appColor.white,
  },
  input: {
    padding: 20,
    fontFamily: AppFontFamily.regular,
    fontSize: 16,
    color: appColor.white,
  },
});

export default CommentModal;
