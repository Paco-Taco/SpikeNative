import {
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/stores/login.store";
import * as ImagePicker from "expo-image-picker";
import axios, { isAxiosError } from "axios";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyBoardAvoidWrapper from "@/components/KeyBoardAvoidWrapper";
import {
  TextField,
  TouchableOpacity,
  Text,
  Button,
  View,
  Image,
  Colors,
} from "react-native-ui-lib";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import SimpleTextField from "@/components/wizard/SimpleTextField";
import LoadingCat from "@/components/shared/LoadingCat";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import PictureInput from "@/components/wizard/PictureInput";
import { router } from "expo-router";

const PetRegister = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;
  const [formData, setFormData] = useState({
    id_owner: idOwner,
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    animal: "",
  });
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: name === "age" ? parseInt(value) : value,
    });
  };

  const isFormComplete = () => {
    return (
      formData.name &&
      formData.gender &&
      formData.age &&
      formData.weight &&
      formData.height &&
      formData.animal &&
      image
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      "Pet created successfully!",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
  
  const handleSubmit = async () => {
    if (!isFormComplete()) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos y selecciona una imagen."
      );
      return;
    }

    setLoading(true); // Muestra el loader

    const data = new FormData();
    data.append(
      "ownerId",
      formData.id_owner !== undefined ? formData.id_owner.toString() : "no_id"
    );
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("age", formData.age.toString());
    data.append("weight", formData.weight);
    data.append("height", formData.height);
    data.append("animal", formData.animal);
    data.append("img", {
      uri: image !== null ? image.uri : "no_uri",
      name: "mascota.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await axiosInstanceSpikeCore.post("/createpet", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      showToastWithGravity()
      router.replace('/petlist')
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("AxiosError: ", error.response?.data);
        Alert.alert(`Error: ${error.response?.data?.message}`);
      }
      Alert.alert("Error", "Hubo un problema al crear la mascota.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCat />;
  }

  return (
    // <KeyBoardAvoidWrapper
    //   scrollEnabled={true}
    //   contentContainerStyle={{ padding: 30 }}
    // >
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ColorPalette.offWhite}
      />
      <ScrollView>
        <View padding-20>
          <Text
            marginV-30
            style={{
              fontSize: 28,
              fontFamily: Fonts.PoppinsBold,
              textAlign: "center",
            }}
          >
            New Pet
          </Text>

          <Text bold>Name</Text>
          <SimpleTextField
            onChangeText={(value: string) => handleInputChange("name", value)}
            value={formData.name}
            placeholder="Name: "
          />
          <Text bold marginV-10>
            Gender
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            {[
              { label: "Male", value: "0" },
              { label: "Female", value: "1" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleInputChange("gender", option.value)}
                style={[
                  styles.chip,
                  formData.gender === option.value && styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.gender === option.value && styles.selectedChipText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text bold marginV-10>
            Age (years old):
          </Text>
          <SimpleTextField
            placeholder="Years"
            onChangeText={(value: string) => handleInputChange("age", value)}
            value={formData.age}
            keyboardType="numeric"
          />

          <Text bold marginT-10>
            Weight (kg):
          </Text>
          <SimpleTextField
            placeholder="Weight"
            onChangeText={(value: string) => handleInputChange("weight", value)}
            value={formData.weight}
            keyboardType="numeric"
          />

          <Text bold marginV-10>
            Size:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            {[
              { label: "Small", value: "1" },
              { label: "Medium", value: "2" },
              { label: "Big", value: "3" },
              { label: "Very big", value: "4" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleInputChange("height", option.value)}
                style={[
                  styles.chip,
                  formData.height === option.value && styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.height === option.value && styles.selectedChipText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text bold marginV-10>
            Animal type:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            {[
              { label: "Dog", value: "1" },
              { label: "Cat", value: "2" },
              { label: "Rabbit", value: "3" },
              { label: "Bird", value: "4" },
              { label: "Reptile", value: "5" },
              { label: "Other", value: "6" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleInputChange("animal", option.value)}
                style={[
                  styles.chip,
                  formData.animal === option.value && styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.animal === option.value && styles.selectedChipText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* <TouchableOpacity
            onPress={pickImage}
            style={{ marginBottom: 10, alignItems: "center" }}
          >
            <Text style={{ color: "blue" }}>Seleccionar Imagen</Text>
          </TouchableOpacity> */}

          {/* {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: 200,
                height: 200,
                marginBottom: 10,
                alignSelf: "center",
              }}
            />
          )} */}

          <View marginV-20>
            <PictureInput onPress={pickImage} image={image} />

            <Button
              marginT-20
              label="Create Pet"
              labelStyle={{ fontFamily: Fonts.PoppinsSemiBold }}
              backgroundColor={ColorPalette.primary}
              disabled={!isFormComplete()}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    // </KeyBoardAvoidWrapper>
  );
};

const styles = StyleSheet.create({
  textField: {
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  scrollView: {
    // marginVertical: 10,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: ColorPalette.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ColorPalette.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  selectedChip: {
    backgroundColor: ColorPalette.primary,
  },
  chipText: {
    color: ColorPalette.primary,
    fontFamily: Fonts.PoppinsMedium,
  },
  selectedChipText: {
    color: "white",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignSelf: "center",
  },
});

export default PetRegister;
