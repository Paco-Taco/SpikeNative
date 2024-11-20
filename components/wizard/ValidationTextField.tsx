import { TextField } from "react-native-ui-lib";
import { ColorPalette } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { Validator } from "react-native-ui-lib/src/components/textField/types";
import { ReactNode, useState } from "react";

const ValidationTextField = ({
  placeholder,
  value,
  onChangeText,
  validate,
  validationMessage,
  secureTextEntry,
  keyboardType,
  trailingAccessory,
  maxLength,
}: {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  validate: Validator[];
  validationMessage: string[];
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  trailingAccessory?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  maxLength?: number;
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
      enableErrors
      validateOnChange
      validate={validate}
      validationMessage={validationMessage}
      retainValidationSpace={false}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      trailingAccessory={trailingAccessory}
      validateOnStart={false}
      maxLength={maxLength}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
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

export default ValidationTextField;
