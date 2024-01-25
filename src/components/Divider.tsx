import { View } from 'react-native';

function Divider() {
  return (
    <View style={{ width: '100%', paddingHorizontal: 20 }}>
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: 'rgba(72, 72, 85, 0.3)',
        }}
      />
    </View>
  );
}

export default Divider;
