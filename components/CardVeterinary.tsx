import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import {
  AnimatedImage,
  Badge,
  Card,
  Colors,
  Image,
  Text,
  View,
} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { Veterinary } from "@/types/userTypes.types";
import { ColorPalette } from "@/constants/Colors";
import { Categories } from "@/constants/Categories";

const CardVeterinary = ({
  item,
  onPress,
}: {
  item: Veterinary;
  onPress: () => void;
}) => (
  <Card
    marginV-10
    padding-20
    borderRadius={10}
    backgroundColor={"white"}
    style={styles.cardStyles}
    onPress={onPress}
  >
    <AnimatedImage
      loader={<ActivityIndicator />}
      source={{ uri: item.img }}
      style={{ borderRadius: 10, resizeMode: "cover", height: 110, }}
      containerStyle={{ height: 110, width: "30%", backgroundColor: Colors.grey70, borderRadius: 10,  }}
    />

    <View style={styles.infoAreaStyles}>
      <Text text60 marginB-5 color={ColorPalette.mediumDark}>
        {item.veterinarieName}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons
          name="map-outline"
          size={14}
          color={ColorPalette.yellowPalette}
        />
        <Text text70 color={ColorPalette.medium} marginL-10>
          {item.street}, {item.locality}, {item.city} {item.cp}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={14} color={ColorPalette.green} />
        <Text text80 color={ColorPalette.medium} marginL-10>
          {item.phone}
        </Text>
      </View>

      <View style={styles.infoRow} marginT-10>
        {item.category.map((category, index) => (
          <Badge
            key={index}
            label={category}
            labelStyle={{
              fontSize: 10,
              color:
                category === Categories.NUTRITION
                  ? ColorPalette.green
                  : category === Categories.RECREATION
                  ? ColorPalette.yellowText
                  : ColorPalette.bluePalette,
            }}
            backgroundColor={
              category === Categories.NUTRITION
                ? ColorPalette.greenLow
                : category === Categories.RECREATION
                ? ColorPalette.yellowLow
                : ColorPalette.blueLow
            }
            marginR-5
          />
        ))}
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  cardStyles: {
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
