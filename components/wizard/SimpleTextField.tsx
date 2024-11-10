import { View, TextField } from "react-native-ui-lib";
import React from "react";
import { ColorPalette } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const SimpleTextField = ({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}) => {
  return (
    <TextField
      placeholder={placeholder}
      placeholderTextColor={ColorPalette.medium}
      value={value}
      onChangeText={onChangeText}
      containerStyle={styles.textFieldContainer}
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
