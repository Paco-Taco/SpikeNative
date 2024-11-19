import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import {
  Button,
  TextField,
  Picker,
  Checkbox,
  DateTimePicker,
  View,
  Avatar,
  LoaderScreen,
  PickerModes,
} from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { VeterinaryService } from "@/services/vetServices";
import { useLoginStore } from "@/stores/login.store";
import { router } from "expo-router";

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const filteredDays = Array.isArray(formData.diasSemana) 
      ? formData.diasSemana.filter(day => validDays.includes(day)) 
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
        formData.category.forEach(cat => data.append("category[]", cat)); 
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await VeterinaryService.updateVeterinary(userId, data, token);
      useLoginStore.getState().updateProfile({
        veterinarieName: formData.veterinarieName,
        img: formData.img,
      });
      Alert.alert("Éxito", response.message);
      router.push("../");
    } catch (error) {
      console.error("Error al actualizar perfil:", error.response?.data || error);
      Alert.alert("Error", `No se pudo actualizar el perfil. Detalles: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleCancel = () => {
    router.navigate("/(app)/(vet)/vetProfile");
  };

  if (loading) {
    return <LoaderScreen message="Cargando..." />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Avatar
        source={{ uri: formData.img || "https://via.placeholder.com/150" }}
        size={100}
        onPress={handleImagePick}
      />
      <TextField
        label="Nombre de la Veterinaria"
        value={formData.veterinarieName}
        onChangeText={(value) => handleChange("veterinarieName", value)}
      />
      <TextField
        label="Email"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextField
        label="Teléfono"
        value={formData.phone}
        onChangeText={(value) => handleChange("phone", value)}
      />
      <TextField
        label="Calle"
        value={formData.street}
        onChangeText={(value) => handleChange("street", value)}
      />
      <TextField
        label="Ciudad"
        value={formData.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      <Picker
        label="Categorías"
        value={formData.category}
        onChange={(value) => handleChange("category", value)}
        mode={PickerModes.MULTI}
        items={categories.map((cat) => ({ label: cat, value: cat }))}
      />
      <Picker
        label="Días de la Semana"
        value={formData.diasSemana}
        onChange={(value) => handleChange("diasSemana", value)}
        mode={PickerModes.MULTI}
        items={dias.map((dia) => ({ label: dia, value: dia }))}
      />
      <DateTimePicker
        label="Hora de Inicio"
        value={parseTimeToDate(formData.horaInicio)}
        mode="time"
        onChange={(value) => handleChange("horaInicio", formatTime(value))}
        dateTimeFormatter={(date) => formatTime(date)}
      />

      <DateTimePicker
        label="Hora de Fin"
        value={parseTimeToDate(formData.horaFin)}
        mode="time"
        onChange={(value) => handleChange("horaFin", formatTime(value))}
        dateTimeFormatter={(date) => formatTime(date)}
      />
      <View row spread marginT-16>
        <Button label="Cancelar" onPress={handleCancel} />
        <Button label="Guardar" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default VetProfile;
