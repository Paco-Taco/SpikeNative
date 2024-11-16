import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import React, { ReactNode } from "react";
import { ExternalPathString, Link, RelativePathString, router } from "expo-router";
import { StyleSheet } from "react-native";
import { ColorPalette } from "@/constants/Colors";

const OptionButton = ({ text, icon, href }: { text: string; icon: ReactNode, href: string }) => {
  return (
    <Link href={href as any} asChild>
    <TouchableOpacity style={styles.optionButton}>
      <Text style={styles.optionText}>{text}</Text>
      {icon}
    </TouchableOpacity>
    </Link>
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

export default OptionButton;
