// app/(app)/(user)/index.tsx

import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, SegmentedControl } from "react-native-ui-lib";
import { FlatList, Platform } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import { useUserStore } from "@/stores/user.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import { Veterinary } from "@/types/userTypes.types";
import CardVeterinary from "@/components/CardVeterinary";
import { useSearch } from "@/app/context/SearchContext";
import { useAuth } from "@/app/context/AuthContext";
import { Fonts } from "@/constants/Fonts";
import Modal from "react-native-modal";
import NewPetModal from "@/components/user/NewPetModal";
import LoadingCat from "@/components/shared/LoadingCat";

const Index = () => {
  const { getVets } = useUserStore((state) => state);
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;
  const [loadingVets, setLoadingVets] = useState(true);

  const [veterinaryClinics, setVeterinaryClinics] = useState<Veterinary[]>([]);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { searchQuery } = useSearch();

  const renderItem = ({ item }: { item: Veterinary }) => {
    // console.log("Item ID:", item.id);  // Check if ID is valid
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
    );

  return (
    <View
      useSafeArea
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
      {/* Barra de filtros de categoría */}
      <View paddingH-20 marginB-20>
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
    </View>
  );
};

export default Index;
