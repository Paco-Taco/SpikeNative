import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Link } from "expo-router";
import { View, Text, Button } from "react-native-ui-lib";

const PetsNotFoundScreen = () => {
  return (
    <View flex center gap-20>
      <Text style={{ fontSize: 20 }}>There aren't any registered pets.</Text>
      <Link asChild href={"/(app)/(user)/petRegister"}>
        <Button
          label="Add pet"
          labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
          backgroundColor={ColorPalette.bluePalette}
        />
      </Link>
    </View>
  );
};

export default PetsNotFoundScreen;
