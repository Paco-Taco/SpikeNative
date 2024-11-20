import { View, TouchableOpacity, Colors } from "react-native-ui-lib";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";

const DoneCheckMark = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) => {
  return (
    <View style={{ top: 10, right: 20 }}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Ionicons
          name="checkmark"
          size={24}
          color={
            disabled === true ? Colors.grey50 : ColorPalette.bluePalette
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default DoneCheckMark;
