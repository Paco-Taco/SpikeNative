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
    <View marginV-20 padding-10 centerH height={height} width={'100%'}>
      {children}
    </View>
  );
};

export default TipContainer;
