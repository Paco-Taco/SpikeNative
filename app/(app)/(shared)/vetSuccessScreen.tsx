import { View, Text, Button } from "react-native-ui-lib";
import LottieView from "lottie-react-native";
import { Fonts } from "@/constants/Fonts";
import { Link } from "expo-router";
import { ColorPalette } from "@/constants/Colors";

const vetSuccessScreen = () => {
  return (
    <View flex centerH centerV padding-40 useSafeArea>
      <LottieView
        source={require("@/assets/lottie/Success.json")}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          fontFamily: Fonts.PoppinsBold,
        }}
      >
        You're in! 🎉
      </Text>
      <Text
        style={{
          fontSize: 18,
          textAlign: "center",
          fontFamily: Fonts.PoppinsMedium,
          marginBottom: 20,
        }}
      >
        You have successfully signed up as a veterinary. Please, log in to
        continue.
      </Text>
      <Link href={"/login"} asChild>
        <Button
          backgroundColor="transparent"
          style={{
            borderWidth: 2,
            borderColor: ColorPalette.medium,
          }}
        >
          <Text color={ColorPalette.medium}>Go to login</Text>
        </Button>
      </Link>
    </View>
  );
};

export default vetSuccessScreen;
