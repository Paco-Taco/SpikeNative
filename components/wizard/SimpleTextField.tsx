import { View, TextField } from "react-native-ui-lib";
import React, { useState } from "react";
import { ColorPalette } from "@/constants/Colors";
import { KeyboardTypeOptions, StyleSheet } from "react-native";

const SimpleTextField = ({
  placeholder,
  value,
  maxLength,
  onChangeText,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextField
      placeholder={placeholder}
      placeholderTextColor={ColorPalette.medium}
      value={value}
      onChangeText={onChangeText}
      containerStyle={{
        ...styles.textFieldContainer,
        borderColor: isFocused ? ColorPalette.primary : ColorPalette.medium,
      }}
      maxLength={maxLength}
      keyboardType={keyboardType}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

const styles = StyleSheet.create({
  textFieldContainer: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: ColorPalette.medium,
  },
});

export default SimpleTextField;
