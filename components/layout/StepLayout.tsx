import { ColorPalette } from "@/constants/Colors";
import { View, Text } from "react-native-ui-lib";

import { ReactNode } from "react";

const StepLayout = ({ children }: { children: ReactNode }) => {
  return (
    <View
      flex
      paddingH-20
      centerH
      backgroundColor={ColorPalette.background}
      style={styles.stepContainer}
    >
      {children}
    </View>
  );
};

const styles = {
  stepContainer: {
    borderRadius: 8,
    marginVertical: 10,
  },
};

export default StepLayout;
