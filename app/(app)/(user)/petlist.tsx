import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, TextInput, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStore } from "@/stores/login.store";
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import LoadingCat from "@/components/shared/LoadingCat";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Colors,
  Button,
  ListItem,
  AnimatedImage,
  GridList,
  GridListItem,
  Card,
} from "react-native-ui-lib";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import { Fonts } from "@/constants/Fonts";
import { ColorPalette } from "@/constants/Colors";
import PetsNotFoundScreen from "@/components/user/PetsNotFoundScreen";
import FontSize from "@/constants/FontSize";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl } from "react-native-gesture-handler";

const PetListAndEdit = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const userId = user?.id;
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtener lista de mascotas
  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceSpikeCore.get(`/getpets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      console.error(
        "Error fetching pets:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "No se pudo cargar la lista de mascotas.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchPets();
  }

  useEffect(() => {
    if (userId && token) {
      fetchPets();
    }
  }, []);

  // Manejo de cambios en el formulario
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo de selección de imagen
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData((prevData) => ({
        ...prevData,
        img: uri,
      }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets(); // Recarga las mascotas cuando la pantalla vuelve a ser el foco
    }, [])
  );
  // Cancelar edición y volver a la lista de mascotas
  const handleCancel = () => {
    setSelectedPet(null);
  };

  const goToEditPetScreen = (pet: any) => {
    router.push({
      pathname: "/editPetScreen",
      params: {
        name: pet.name,
        petId: pet.id,
        img: pet.img,
        weight: pet.weight,
        height: pet.height,
      },
    });
  };

  const renderPets = ({ item }: { item: any }) => {
    return (
      <Card flex onPress={() => goToEditPetScreen(item)}>
        <Card.Section
          imageSource={{ uri: item.img }}
          imageStyle={{
            width: "100%",
            height: 150,
            borderRadius: 5,
          }}
        />
        <View padding-10>
          <Text
            center
            style={{
              fontSize: FontSize.medium,
              fontFamily: Fonts.PoppinsSemiBold,
            }}
          >
            {item.name}
          </Text>
          <Text center>  {item.age} {item.age === 1 ? "year old" : "years old"}</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AbsoluteBackArrow color={Colors.grey30} />
      {loading ? (
        <LoadingCat />
      ) : pets.length === 0 ? (
        <PetsNotFoundScreen />
      ) : selectedPet ? (
        // Vista de edición de mascota
        <View style={styles.container}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={
                formData.img
                  ? { uri: formData.img }
                  : require("@/assets/images/catbox.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la mascota"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Peso"
            value={String(formData.weight)}
            onChangeText={(text) => handleChange("weight", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Altura"
            value={formData.height}
            onChangeText={(text) => handleChange("height", text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View flex>
          <Text style={styles.sectionTitle}>Your pets</Text>
          <GridList
            listPadding={30}
            data={pets}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPets}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          />

          <Link asChild href={"/petRegister"}>
            <Button
              round
              size="large"
              padding-15
              backgroundColor={ColorPalette.bluePalette}
              enableShadow
              style={{ position: "absolute", bottom: 30, right: 30 }}
            >
              <Ionicons name="add" size={30} color="white" />
            </Button>
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  sectionTitle: {
    fontSize: 28,
    paddingHorizontal: 20,
    fontFamily: Fonts.PoppinsBold,
    textAlign: "center",
    marginVertical: 50,
  },
  container: { padding: 20, alignItems: "center" },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: { padding: 10, backgroundColor: "#ccc", borderRadius: 5 },
  saveButton: { padding: 10, backgroundColor: "#00f", borderRadius: 5 },
  buttonText: { color: "#fff" },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  petImage: {
    marginHorizontal: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  petName: { fontSize: 18 },
});

export default PetListAndEdit;
