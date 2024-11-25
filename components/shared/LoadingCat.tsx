import { LoaderScreen } from "react-native-ui-lib";
import LottieView from "lottie-react-native";
import { Fonts } from "@/constants/Fonts";

const LoadingCat = () => {
  return (
    <LoaderScreen
      message="Loading..."
      overlay
      backgroundColor="white"
      messageStyle={{ fontFamily: Fonts.PoppinsRegular }}
      customLoader={
        <LottieView
          source={require("@/assets/lottie/LoadingCat.json")}
          autoPlay
          loop
          style={{ width: 125, height: 125 }}
        />
      }
    />
  );
};

export default LoadingCat;
