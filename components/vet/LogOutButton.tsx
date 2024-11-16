import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Dialog,
} from "react-native-ui-lib";
import React, { ReactNode, useState } from "react";
import { StyleSheet } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useAuth } from "@/app/context/AuthContext";

const LogOutButton = ({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Text style={styles.optionText}>{text}</Text>
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    backgroundColor: ColorPalette.white,
    borderRadius: 8,
    marginBottom: 20,
  },
  optionText: {
    fontSize: 16,
    color: ColorPalette.mediumDark,
  },
});

export default LogOutButton;
