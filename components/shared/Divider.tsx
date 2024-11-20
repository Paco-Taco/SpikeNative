import { View, Text, Colors } from "react-native-ui-lib";
import React from "react";
import { StyleSheet } from "react-native";

const Divider = () => {
  return <View style={styles.divider}></View>;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.grey50,
    marginVertical: 10,
  },
});

export default Divider;
