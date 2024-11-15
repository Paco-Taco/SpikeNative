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

const LocationSelector = ({ onLocationSelect, currentLocation = "Manzanillo" }) => {
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
        animationType="slide"
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
                    <Text style={styles.locationText}>{item}</Text>
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
    backgroundColor: ColorPalette.lightGraphite,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  spinnerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: ColorPalette.graphitePalette,
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
  },
  locationButton: {
    backgroundColor: ColorPalette.lightGraphite,
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
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: ColorPalette.medium,
    borderRadius: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LocationSelector;
