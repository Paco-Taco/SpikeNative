import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";

const AbsoluteBackArrow = ({
  color,
  background,
}: {
  color: string;
  background?: boolean;
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      backgroundColor={background ? 'rgba(0, 0, 0, 0.4)' : "transparent"}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default AbsoluteBackArrow;
