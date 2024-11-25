import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { ColorPalette } from "@/constants/Colors";

const BackArrow = () => {
  const navigation = useNavigation();
  return (
    <View style={{ top: 10, left: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={ColorPalette.medium} />
      </TouchableOpacity>
    </View>
  );
};

export default BackArrow;
