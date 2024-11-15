import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Button,
  Dialog,
  SegmentedControl,
} from "react-native-ui-lib";
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

const Index = () => {
  const { getVets } = useUserStore((state) => state);
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;

  const [veterinaryClinics, setVeterinaryClinics] = useState<Veterinary[]>([]);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { searchQuery } = useSearch();

  const renderItem = ({ item }: { item: Veterinary }) => (
    <CardVeterinary item={item} />
  );

  useEffect(() => {
    if (!idOwner) {
      return;
    }
    const fetchVets = async () => {
      const result = await getVets();
      setVeterinaryClinics(result ? result.veterinaries : []);
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ColorPalette.offWhite,
        paddingTop: Platform.OS === "android" ? 90 : 60,
      }}
    >
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

      <View paddingH-20 flex>
        <FlatList
          data={filteredVeterinaryClinics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Dialog
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        containerStyle={{
          backgroundColor: ColorPalette.background,
          padding: 20,
          borderRadius: 8,
          opacity: 1,
        }}
        overlayBackgroundColor="rgba(0, 0, 0, 0.7)"
      >
        <Text
          marginB-20
          color={ColorPalette.black}
          style={{ fontFamily: Fonts.PoppinsBold, fontSize: 20 }}
        >
          Registra tu primer mascota
        </Text>
        <Text marginB-20 color={ColorPalette.mediumDark}>
          Aún no tienes mascotas registradas. Registra tu primera mascota para
          empezar.
        </Text>
        <View row spread marginT-10>
          <Button
            label="Omitir"
            labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
            onPress={() => setShowModal(false)}
            backgroundColor={ColorPalette.white}
            color={ColorPalette.medium}
          />
          <Button
            label="Registrar Mascota"
            labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
            onPress={() => {
              setShowModal(false);
              router.push("/petRegister");
            }}
            backgroundColor={ColorPalette.bluePalette}
          />
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

export default Index;
