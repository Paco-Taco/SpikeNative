import { TouchableOpacity, Text, Image } from "react-native-ui-lib";
import React from "react";
import { ColorPalette } from "@/constants/Colors";
import { ImagePickerAsset } from "expo-image-picker";

const PictureInput = ({
  onPress,
  image,
}: {
  onPress: () => void;
  image: ImagePickerAsset | null;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "100%",
        borderWidth: 1,
        borderRadius: 15,
        padding: 20,
        borderStyle: "dashed",
        borderColor: ColorPalette.medium,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: ColorPalette.bluePalette, margin: 10 }}>
        Select picture
      </Text>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{
            width: 200,
            height: 200,
            marginBottom: 10,
            alignSelf: "center",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default PictureInput;
