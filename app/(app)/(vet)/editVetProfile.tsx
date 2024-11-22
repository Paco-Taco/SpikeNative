import React, { useState, useEffect } from "react";
import { ScrollView, Alert, StyleSheet } from "react-native";
import {
  Button,
  TextField,
  Picker,
  Checkbox,
  DateTimePicker,
  View,
  Text,
  Avatar,
  LoaderScreen,
  PickerModes,
} from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { VeterinaryService } from "@/services/vetServices";
import { useLoginStore } from "@/stores/login.store";
import { router } from "expo-router";
import LoadingCat from "@/components/shared/LoadingCat";
import EditProfileLayout from "@/components/layout/EditProfileLayout";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import EditableAvatar from "@/components/shared/EditableAvatar";
import { Fonts } from "@/constants/Fonts";
import SimpleTextField from "@/components/wizard/SimpleTextField";
import ValidationTextField from "@/components/wizard/ValidationTextField";
import MultiPicker from "@/components/wizard/MultiPicker";
import HourPicker from "@/components/wizard/HourPicker";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const [loading, setLoading] = useState(true);
  const userId = user?.id;

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    veterinarieName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    locality: "",
    cologne: "",
    number_int: "",
    cp: "",
    rfc: "",
    category: [],
    diasSemana: [],
    horaInicio: "0:00",
    horaFin: "0:00",
    img: "",
    img_public_id: null,
  });

  const categories = ["CARE", "RECREATION", "NUTRITION"];
  const dias = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseTimeToDate = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  useEffect(() => {
    const fetchVeterinaryProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceSpikeCore.get(
          `/getveterinary/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data.veterinary;

        setFormData({
          veterinarieName: data.veterinarieName,
          email: data.email,
          phone: data.phone,
          street: data.street,
          city: data.city,
          locality: data.locality,
          cologne: data.cologne,
          number_int: data.number_int,
          cp: data.cp,
          rfc: data.rfc,
          category: data.category || [],
          diasSemana: data.dias || [],
          horaInicio: data.hora_ini || "",
          horaFin: data.hora_fin || "",
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
      fetchVeterinaryProfile();
    }
  }, [userId, token]);

  const handleChange = (name: string, value: string) => {
    console.log(name, value);
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

  const handleSubmit = async () => {
    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const filteredDays = Array.isArray(formData.diasSemana)
      ? formData.diasSemana.filter((day) => validDays.includes(day))
      : [];

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "img" && formData.img) {
        data.append("img", {
          uri: formData.img,
          name: "vet_image.jpg",
          type: "image/jpeg",
        });
      } else if (key === "diasSemana") {
        filteredDays.forEach((day) => data.append("diasSemana[]", day));
      } else if (key === "horaInicio") {
        data.append("horaInicio", formData.horaInicio);
      } else if (key === "horaFin") {
        data.append("horaFin", formData.horaFin);
      } else if (key === "category") {
        formData.category.forEach((cat) => data.append("category[]", cat));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await VeterinaryService.updateVeterinary(
        userId,
        data,
        token
      );
      useLoginStore.getState().updateProfile({
        veterinarieName: formData.veterinarieName,
        img: formData.img,
      });
      Alert.alert("Éxito", response.message);
      router.push("../");
    } catch (error) {
      console.error("Error al actualizar perfil: ", error);
      Alert.alert(
        "Error",
        `${error}`
      );
    }
  };
  const handleCancel = () => {
    router.navigate("/(app)/(vet)/vetProfile");
  };

  const isFormValid = () => {
    return (
      formData.veterinarieName.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.street.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.category.length > 0 &&
      formData.diasSemana.length > 0 &&
      formData.horaInicio !== "0:00" &&
      formData.horaFin !== "0:00" &&
      isValidPhoneNumber(formData.phone)
    );
  };

  if (loading) {
    return <LoadingCat />;
  }

  return (
    <EditProfileLayout
      disabledWhen={!isFormValid()}
      handleSubmit={handleSubmit}
    >
      <EditableAvatar img={formData.img} onPress={handleImagePick} />
      <Text style={styles.profileName}>{formData.veterinarieName}</Text>
      <View style={styles.formContainer}>
        <Text bold>Veterinary name</Text>
        <SimpleTextField
          placeholder="Nombre de la Veterinaria"
          value={formData.veterinarieName}
          onChangeText={(value) => handleChange("veterinarieName", value)}
        />

        <Text bold>Phone number</Text>
        <ValidationTextField
          placeholder="Phone number"
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
          keyboardType="phone-pad"
          validate={["required", (value) => isValidPhoneNumber(value || "")]}
          validationMessage={["Field is required", "Phone number is invalid"]}
          maxLength={10}
        />

        <Text bold>Street name</Text>
        <SimpleTextField
          placeholder="Street"
          value={formData.street}
          onChangeText={(value) => handleChange("street", value)}
        />

        <Text bold>City</Text>
        <SimpleTextField
          placeholder="City"
          value={formData.city}
          onChangeText={(value) => handleChange("city", value)}
        />

        <Text bold>Categories</Text>
        <MultiPicker
          title="Categories"
          placeholder="Select categories"
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
        >
          {categories.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </MultiPicker>

        <Text bold>Work days</Text>
        <MultiPicker
          title="Work days"
          placeholder="Select work days"
          value={formData.diasSemana}
          onChange={(value) => handleChange("diasSemana", value)}
        >
          {dias.map((dia, index) => (
            <Picker.Item key={index} label={dia} value={dia} />
          ))}
        </MultiPicker>

        <Text bold>Work hours</Text>
        <HourPicker
          label="Opening time"
          value={parseTimeToDate(formData.horaInicio)}
          onChange={(value) => handleChange("horaInicio", formatTime(value))}
          dateTimeFormatter={(date) => formatTime(date)}
        />

        <HourPicker
          label="Closing time"
          value={parseTimeToDate(formData.horaFin)}
          onChange={(value) => handleChange("horaFin", formatTime(value))}
          dateTimeFormatter={(date) => formatTime(date)}
        />
      </View>
      {/* <View row spread marginT-16>
        <Button label="Cancelar" onPress={handleCancel} />
        <Button label="Guardar" onPress={handleSubmit} />
      </View> */}
    </EditProfileLayout>
  );
};

const styles = StyleSheet.create({
  profileName: {
    fontSize: 24,
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

export default VetProfile;
