import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStore } from "@/stores/login.store";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import LoadingCat from "@/components/shared/LoadingCat";
import {
  Avatar,
  TextField,
  View,
  TouchableOpacity,
  Text,
  Incubator,
} from "react-native-ui-lib";
import { colorsPalette } from "react-native-ui-lib/src/style/colorsPalette";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import SimpleTextField from "@/components/wizard/SimpleTextField";
import BackArrow from "@/components/shared/BackArrow";
import DoneCheckMark from "@/components/shared/DoneCheckMark";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";
import ValidationTextField from "@/components/wizard/ValidationTextField";
import { isValidEmail } from "@/utils/isValidEmail";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import EditableAvatar from "@/components/shared/EditableAvatar";
import EditProfileLayout from "@/components/layout/EditProfileLayout";

const EditPetOwnerProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const [loading, setLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const userId = user?.id;
  const router = useRouter();
  const navigation = useNavigation();
  const [isToastSuccesShown, setIsToastSuccesShown] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    number_int: "",
    city: "",
    locality: "",
    cp: "",
    img: "",
    img_public_id: null,
  });
  const { updateProfile } = useLoginStore((state) => state);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceSpikeCore.get(
          `/getUsers/${userId}`
        );
        const data = response.data;
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          number_int: data.number_int,
          city: data.city,
          locality: data.locality,
          cp: data.cp,
          img: data.img || "",
          img_public_id: data.img_public_id || null,
        });
      } catch (error) {
        console.error(
          "Error fetching profile data:",
          error.response?.data || error.message
        );
        Alert.alert("Error", "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchOwnerProfile();
    }
  }, [userId, token]);

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
      setFormData({
        ...formData,
        img: uri,
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.cp.trim() !== "" &&
      isValidEmail(formData.email) &&
      isValidPhoneNumber(formData.phone)
    );
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      "All changes saved",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Agregar datos al FormData solo si tienen un valor definido
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        if (key === "img" && formData.img) {
          data.append("img", {
            uri: formData.img,
            name: "owner_image.jpg",
            type: "image/jpeg",
          });
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    console.log("Datos a enviar:", data);

    try {
      setIsUpdatingProfile(true);
      const response = await axiosInstanceSpikeCore.post(
        `/updateUser/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        number_int: formData.number_int,
        city: formData.city,
        locality: formData.locality,
        cp: formData.cp,
        img: formData.img,
      });

      // Alert.alert("Success", response.data.message);
      showToastWithGravity();
      router.push("../");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el perfil. Intente nuevamente."
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancel = () => {
    router.push("../");
  };

  if (loading) {
    return <LoadingCat />;
  }

  if (isUpdatingProfile) return <LoadingCat />;

  return (
    <EditProfileLayout
      disabledWhen={!isFormValid()}
      handleSubmit={handleSubmit}
    >
      <EditableAvatar img={formData.img} onPress={handleImagePick} />

      <Text style={styles.profileName}>{formData.firstName} {formData.lastName}</Text>

      <View style={styles.formContainer}>
        <Text bold>First Name</Text>
        <SimpleTextField
          placeholder="First name"
          value={formData.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />

        <Text bold>Last name</Text>
        <SimpleTextField
          placeholder="Last name"
          value={formData.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />

        <Text bold>Telefono</Text>
        <ValidationTextField
          placeholder="Phone number"
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
          keyboardType="phone-pad"
          validate={["required", (value) => isValidPhoneNumber(value || "")]}
          validationMessage={["Field is required", "Phone number is invalid"]}
          maxLength={10}
        />

        <Text style={styles.subtext}>DATOS DE DIRECCION</Text>
        <Text bold>Ciudad</Text>
        <SimpleTextField
          placeholder="Ciudad"
          value={formData.city}
          onChangeText={(text) => handleChange("city", text)}
        />

        <Text bold>Postal Code</Text>
        <SimpleTextField
          placeholder="CP"
          value={formData.cp}
          onChangeText={(text) => handleChange("cp", text)}
          keyboardType="number-pad"
        />
      </View>
      {/* <Incubator.Dialog
        useSafeArea
        center
        visible={isUpdatingProfile}
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
      </Incubator.Dialog> */}
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

export default EditPetOwnerProfile;
