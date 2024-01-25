import { Image, Text, View } from 'react-native';
import { Player } from 'src/api/DataType';
import { appColor } from 'src/theme/color';
import { AppFontFamily } from 'src/theme/font';

function PlayerCard({ player: { picture, name } }: { player: Player }) {
  return (
    <View style={{ marginHorizontal: 10 }}>
      <Image
        source={{ uri: picture }}
        style={{
          width: 120,
          height: 120,
          marginBottom: 10,
          backgroundColor: 'white',
          borderRadius: 5,
        }}
      />
      <Text
        style={{
          fontFamily: AppFontFamily.regular,
          fontSize: 15,
          color: appColor.white,
        }}>
        {name}
      </Text>
    </View>
  );
}

export default PlayerCard;
