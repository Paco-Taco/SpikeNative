import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { ColorPalette } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["40%"], []);
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
  const { dismiss } = useBottomSheetModal();

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: ColorPalette.graphitePalette }}
      handleIndicatorStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View>
          <Text style={styles.subheader}>Your location</Text>
          <Link href={"/"} asChild>
            <TouchableOpacity>
              <View style={styles.item}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={ColorPalette.medium}
                />
                <Text style={styles.itemText}>Current location</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={ColorPalette.primary}
                />
              </View>
            </TouchableOpacity>
          </Link>

          <Text style={styles.subheader}>Text 2</Text>
          <TouchableOpacity>
            <View style={styles.item}>
              <Ionicons
                name="analytics"
                size={20}
                color={ColorPalette.medium}
              />
              <Text style={styles.itemText}>Subtext 2</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={ColorPalette.primary}
              />
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
    color: "white",
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
    backgroundColor: ColorPalette.lightGraphite,
    borderColor: "#434e5b",
    borderWidth: 1,
  },
  itemText: {
    color: "white",
    flex: 1,
  },
  buttonContainer: {

  },
});

export default BottomSheet;
