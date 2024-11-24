import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-ui-lib";

const AbsoluteBackArrow = ({
  color,
  background,
}: {
  color: string;
  background?: boolean;
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // Obtiene los márgenes seguros

  return (
    <TouchableOpacity
      style={[styles.backButton, { top: insets.top + 50 }]} // Ajusta según el área segura
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
    left: 20,
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default AbsoluteBackArrow;
