import { View, Text, Picker, PickerValue } from "react-native-ui-lib";
import React, { ReactNode } from "react";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { PickerMultiValue } from "react-native-ui-lib/src/components/picker/types";

const MultiPicker = ({
  children,
  value,
  onChange,
  title,
  placeholder = "Select",
}: {
  children: ReactNode;
  value: PickerMultiValue;
  onChange: (value: PickerValue) => void;
  title: string;
  placeholder?: string;
}) => {
  return (
    <View
      flex
      style={{
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        width: "100%",
        marginBottom: 15,
        borderColor: ColorPalette.medium,
      }}
    >
      <Picker
        topBarProps={{ title: title }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        mode={Picker.modes.MULTI}
        placeholderTextColor={ColorPalette.medium}
        trailingAccessory={
          <Ionicons name="chevron-down" size={14} color={ColorPalette.medium} />
        }
      >
        {children}
      </Picker>
    </View>
  );
};

export default MultiPicker;
