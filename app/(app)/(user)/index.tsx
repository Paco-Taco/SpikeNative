import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Button, SegmentedControl } from "react-native-ui-lib";
import { FlatList, Platform, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Usando los íconos incluidos con Expo
import { ColorPalette } from "@/constants/Colors";
import { useUserStore } from "@/stores/user.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import { Veterinary } from "@/types/userTypes.types";
import CardVeterinary from "@/components/CardVeterinary";
import { useSearch } from "@/app/context/SearchContext";
import LoadingCat from "@/components/shared/LoadingCat";
import NewPetModal from "@/components/user/NewPetModal";

const Index = () => {
  const { getVets } = useUserStore((state) => state);
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;
  const [loadingVets, setLoadingVets] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [veterinaryClinics, setVeterinaryClinics] = useState<Veterinary[]>([]);
  const [pets, setPets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [postalCodeFilter, setPostalCodeFilter] = useState(""); // Estado para el código postal
  const { searchQuery } = useSearch();

  const renderItem = ({ item }: { item: Veterinary }) => {
    return (
      <CardVeterinary
        item={item}
        onPress={() => {
          if (pets.length > 0) {
            router.push(`/appointmentBooking/${item.id}`);
          } else {
            setShowModal(true);
          }
        }}
      />
    );
  };

  useEffect(() => {
    if (!idOwner) {
      return;
    }

    const fetchVets = async () => {
      try {
        setLoadingVets(true);
        const result = await getVets();
        setVeterinaryClinics(result ? result.veterinaries : []);
      } catch (error) {
        console.error("Error al obtener veterinarias:", error);
      } finally {
        setLoadingVets(false);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await axiosInstanceSpikeCore.get(
          `/getpets/${idOwner}`
        );
        const petsData = response.data || [];
        setPets(petsData);

        if (petsData.length === 0) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    fetchVets();
    fetchPets();
  }, [idOwner, getVets]);

  const categories = ["all", "NUTRITION", "RECREATION", "CARE"];

  const filteredVeterinaryClinics = veterinaryClinics
    .filter(
      (clinic) =>
        selectedCategory === "all" || clinic.category.includes(selectedCategory)
    )
    .filter((clinic) =>
      clinic.veterinarieName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (clinic) =>
        postalCodeFilter === "" || clinic.cp === postalCodeFilter
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ColorPalette.offWhite,
        paddingTop: Platform.OS === "android" ? 140 : 60,
      }}
    >
    <NewPetModal
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        onOk={() => {
          setShowModal(false);
          router.push("/petRegister");
        }}
      />
      <View paddingH-20 marginB-10>
        <SegmentedControl
          segments={[
            { label: "All" },
            { label: "Nutrition" },
            { label: "Recreation" },
            { label: "Care" },
          ]}
          onChangeIndex={(index) => {
            setSelectedCategory(categories[index]);
          }}
          activeColor="white"
          activeBackgroundColor={
            selectedCategory === "all"
              ? ColorPalette.darkGrayPalette
              : selectedCategory === "NUTRITION"
              ? ColorPalette.green
              : selectedCategory === "RECREATION"
              ? ColorPalette.yellowPalette
              : ColorPalette.bluePalette
          }
          style={{ width: "100%" }}
        />
      </View>

      <View row paddingH-20 marginB-20 centerV>
        <TextInput
             style={{
              flex: 1,
              backgroundColor: "#f8f9fb", 
              borderRadius: 8,
              padding: 10,
              marginRight: 10,
              borderWidth: 1,
              borderColor: "#e0e0e0", 
              shadowColor: "#000", 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 4, 
              elevation: 2, 
            }}
          placeholder="Buscar por CP"
          value={postalCodeFilter}
          keyboardType="numeric"
          onChangeText={setPostalCodeFilter}
        />
        <Button
          iconSource={() => (
            <MaterialIcons name="clear" size={18} color="white" />
          )}
          size={Button.sizes.small} 
          backgroundColor={ColorPalette.darkGrayPalette}
          onPress={() => setPostalCodeFilter("")} 
        />
      </View>

      {loadingVets ? (
        <LoadingCat />
      ) : (
        <View paddingH-20 flex>
          <FlatList
            data={filteredVeterinaryClinics}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
