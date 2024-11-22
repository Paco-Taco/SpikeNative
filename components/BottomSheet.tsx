import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { ColorPalette } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LocationSelector from "./LocationSelector";

export type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["40%"], []);
  const [currentLocation, setCurrentLocation] = useState("Manzanillo");
  const { dismiss } = useBottomSheetModal();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
  };

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: ColorPalette.grey }}
      handleIndicatorStyle={{ backgroundColor: ColorPalette.medium }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View>
          <Text style={styles.subheader}>Your location</Text>
          <View style={styles.item}>
            <Ionicons
              name="location-outline"
              size={20}
              color={ColorPalette.medium}
            />
            <LocationSelector
              currentLocation={currentLocation}
              onLocationSelect={handleLocationSelect}
            />
            <Ionicons
              name="chevron-forward"
              size={20}
              color={ColorPalette.primary}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => dismiss()}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
    color: ColorPalette.medium,
  },
  button: {
    backgroundColor: ColorPalette.primary,
    padding: 16,
    margin: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 16,
    backgroundColor: ColorPalette.white,
    borderColor: "#434e5b",
  },
  itemText: {
    color: "white",
    flex: 1,
  },
  buttonContainer: {},
});

export default BottomSheet;
