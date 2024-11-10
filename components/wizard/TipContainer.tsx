import { View, Text } from "react-native-ui-lib";
import React, { ReactNode } from "react";
import { DimensionValue } from "react-native";

const TipContainer = ({
  children,
  height,
}: {
  children: ReactNode;
  height: DimensionValue;
}) => {
  return (
    <View marginV-20 centerV padding-20 centerH height={height}>
      {children}
    </View>
  );
};

export default TipContainer;
