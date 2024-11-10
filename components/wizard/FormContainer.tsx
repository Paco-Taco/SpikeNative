import { View } from "react-native-ui-lib";
import { ReactNode } from "react";

const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <View paddingT-20 style={{ width: "100%" }}>
      {children}
    </View>
  );
};

export default FormContainer;
