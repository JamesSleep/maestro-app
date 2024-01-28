import { Modal, Pressable, View } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/AntDesign';
import { appColor } from 'src/theme/color';

function GalleryModal({
  visible,
  onClose,
  item,
  initialIndex,
}: {
  visible: boolean;
  onClose: any;
  item: string[];
  initialIndex: number;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <Pressable
            style={{
              position: 'absolute',
              top: 20 + getStatusBarHeight(true) / 2,
              left: 20,
              zIndex: 101,
            }}>
            <Icon
              name="close"
              color={appColor.white}
              onPress={onClose}
              size={25}
            />
          </Pressable>
          <Gallery
            data={item}
            onSwipeToClose={onClose}
            loop
            initialIndex={initialIndex}
          />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

export default GalleryModal;
