import { StyleSheet } from "react-native";
import React from "react";
import { Card, Image, Text, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { Veterinary } from "@/types/userTypes.types";
import { ColorPalette } from "@/constants/Colors";

const CardVeterinary = ({ item }: { item: Veterinary }) => {
  return (
    <Card
      marginV-10
      padding-20
      borderRadius={10}
      backgroundColor={ColorPalette.lightGraphite}
      style={styles.cardStyles}
      onPress={() => {}}
    >
      <Image
        source={{ uri: item.img }}
        style={{ height: 110, width: "30%", borderRadius: 10 }}
      />

      <View style={styles.infoAreaStyles}>
        <Text text60 marginB-5 color={ColorPalette.grey}>
          {item.veterinarieName}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="map-outline" size={14} color={ColorPalette.grey} />
          <Text text70 color={ColorPalette.grey} marginL-10>
            {item.street}, {item.locality}, {item.city} {item.cp}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={14} color={ColorPalette.grey} />
          <Text text80 color={ColorPalette.grey} marginL-10>
            {item.phone}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyles: {
    shadowColor: "black",
    flexDirection: "row",
    alignItems: "center",
  },
  infoAreaStyles: {
    flex: 1,
    marginLeft: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default CardVeterinary;
