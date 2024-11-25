import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ColorPalette } from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { Fonts } from "@/constants/Fonts";

const LocationSelector = ({
  onLocationSelect,
  currentLocation = "Manzanillo",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const locations = [
    "Manzanillo",
    "Colima",
    "Villa de Álvarez",
    "Tecomán",
    "Armería",
  ];

  const handleLocationSelect = (location) => {
    setIsLoading(true);
    setSelectedLocation(location);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setIsModalVisible(false); // Close modal after selection

      if (location !== "Manzanillo") {
        Alert.alert(
          "No Service Available",
          `Sorry, there are currently no veterinary services available in ${location}. Please select a different location.`,
          [
            {
              text: "Return to Manzanillo",
              onPress: () => {
                setSelectedLocation("Manzanillo");
                onLocationSelect("Manzanillo");
              },
            },
          ]
        );
      } else {
        onLocationSelect(location);
      }
    }, 1000);
  };

  return (
    <View>
      {/* Button to open spinner */}
      <TouchableOpacity
        style={styles.spinnerButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.spinnerButtonText}>
          {selectedLocation ? selectedLocation : "Select Location"}
        </Text>
      </TouchableOpacity>

      {/* Spinner Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={ColorPalette.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={locations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      item === selectedLocation && styles.selectedLocation,
                    ]}
                    onPress={() => handleLocationSelect(item)}
                  >
                    <Text
                      style={[
                        styles.locationText,
                        item === selectedLocation && {
                          color: ColorPalette.white,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerButton: {
    borderRadius: 4,
    alignItems: "center",
  },
  spinnerButtonText: {
    color: ColorPalette.medium,
    fontSize: FontSize.medium,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: ColorPalette.offWhite,
    width: "80%",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontFamily: Fonts.PoppinsRegular,
  },
  locationButton: {
    backgroundColor: ColorPalette.white,
    padding: 12,
    borderRadius: 4,
    marginVertical: 4,
    width: "100%",
    alignItems: "center",
  },
  selectedLocation: {
    backgroundColor: ColorPalette.primary,
  },
  locationText: {
    color: ColorPalette.medium,
    fontFamily: Fonts.PoppinsMedium,

  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 4,
  },
  closeButtonText: {
    color: ColorPalette.medium,
    fontSize: FontSize.medium,
    fontFamily: Fonts.PoppinsLight,
  },
});

export default LocationSelector;
