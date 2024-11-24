import { View, Text, TouchableOpacity, Colors } from "react-native-ui-lib";
import React, { ReactNode } from "react";
import { ExternalPathString, Link, RelativePathString, router } from "expo-router";
import { StyleSheet } from "react-native";
import { ColorPalette } from "@/constants/Colors";

const OptionButton = ({ text, icon, href }: { text: string; icon: ReactNode, href: string }) => {
  return (
    <Link href={href as any} push asChild>
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
    marginBottom: 1.5,
    borderColor: Colors.grey50
  },
  optionText: {
    fontSize: 16,
    color: ColorPalette.mediumDark,
  },
});

export default OptionButton;
