import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ColorPalette } from "@/constants/Colors";
import { useNavigation } from "expo-router";

const Filter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Filter</Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.fullButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: ColorPalette.graphitePalette,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    padding: 10,
    backgroundColor: ColorPalette.graphitePalette,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 }, // Ajuste de la dirección de la sombra
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  fullButton: {
    backgroundColor: ColorPalette.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Filter;
