import EditProfileLayout from "@/components/layout/EditProfileLayout";
import EditableAvatar from "@/components/shared/EditableAvatar";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { Alert, StyleSheet, ToastAndroid } from "react-native";
import { View, Text, Incubator, TextField } from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";
import { useLoginStore } from "@/stores/login.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import SimpleTextField from "@/components/wizard/SimpleTextField";

const editPetScreen = () => {
  const params = useLocalSearchParams();
  const { name, petId, img, weight, height } = params;
  const [formData, setFormData] = useState({
    name: name,
    weight: String(weight),
    height: height,
    img: img,
  });
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const navigation = useNavigation();

  // Manejo de cambios en el formulario
  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      "All changes saved",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.weight.trim() !== "" &&
      formData.height.trim() !== ""
    );
  };

  // Manejo de actualización de mascota
  const handleSubmit = async () => {
    const data = new FormData();

    // Iterar sobre los datos del formulario y agregar al FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        if (key === "img" && formData.img) {
          data.append("img", {
            uri: formData.img,
            name: "pet_image.jpg",
            type: "image/jpeg",
          });
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      setIsSavingChanges(true);
      await axiosInstanceSpikeCore.post(`/updatepet/${petId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      router.replace("/petlist")
      showToastWithGravity();
    } catch (error) {
      setIsSavingChanges(false);
      console.error(
        "Error actualizando la mascota:",
        error.response?.data || error
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar la mascota. Intente nuevamente."
      );
    } finally {
        setIsSavingChanges(false);
    }
  };

  return (
    <EditProfileLayout
      disabledWhen={!isFormValid()}
      handleSubmit={handleSubmit}
    >
      <EditableAvatar img={formData.img} onPress={handleImagePick} />

      <Text style={styles.profileName}>{formData.name}</Text>

      <View style={styles.formContainer}>
        <Text bold>Pet Name</Text>
        <SimpleTextField
          label="Name"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />

        <Text bold>Weight</Text>
        <SimpleTextField
          label="Weight"
          value={formData.weight}
          onChangeText={(value) => handleChange("weight", value)}
        />

        <Text bold>Height</Text>
        <SimpleTextField
          label="Height"
          value={formData.height}
          onChangeText={(value) => handleChange("height", value)}
        />
      </View>
      <Incubator.Dialog
        useSafeArea
        center
        visible={isSavingChanges}
        ignoreBackgroundPress
        containerStyle={{
          borderRadius: 8,
          backgroundColor: ColorPalette.background,
          padding: 30,
        }}
      >
        <View center>
          <LottieView
            source={require("@/assets/lottie/LoadingCat.json")}
            autoPlay
            loop
            style={{
              width: 100,
              height: 100,
              margin: 10,
            }}
          />
          <Text center>Guardando...</Text>
        </View>
      </Incubator.Dialog>
    </EditProfileLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.white,
  },
  container: {
    padding: 20,
    flex: 1,
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  saveButton: {
    padding: 10,
    backgroundColor: "#00f",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  subtext: {
    marginTop: 20,
    alignSelf: "center",
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 20,
  },
});

export default editPetScreen;
