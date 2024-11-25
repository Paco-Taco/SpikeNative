import EditProfileLayout from "@/components/layout/EditProfileLayout";
import EditableAvatar from "@/components/shared/EditableAvatar";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { Alert, Modal, StyleSheet, ToastAndroid } from "react-native";
import {
  View,
  Text,
  Incubator,
  TextField,
  Button,
  Colors,
  FloatingButton,
  ActionSheet,
  Image,
  TouchableOpacity,
} from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";
import { useLoginStore } from "@/stores/login.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import SimpleTextField from "@/components/wizard/SimpleTextField";
import { Ionicons } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import LoadingCat from "@/components/shared/LoadingCat";
import { ScrollView } from "react-native-gesture-handler";

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
  const [isRipModalVisible, setIsRipModalVisible] = useState(false);
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

      showToastWithGravity();
      router.replace("/petlist");
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

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handleMarkAsPassedAway = async () => {
    try {
      setIsSavingChanges(true);
      const currentDate = getCurrentDateFormatted();
  
      await axiosInstanceSpikeCore.post(
        `/deathPet`,
        {
          petId: parseInt(petId,10),
          dateOfDeath: currentDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setIsRipModalVisible(false);
      ToastAndroid.showWithGravity(
        "Pet marked as passed away",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
  
      router.replace("/petlist");
    } catch (error: any) {
      console.error(
        "Error marking pet as passed away:",
        error.response?.data || error
      );
      Alert.alert(
        "Error",
        "Could not mark the pet as passed away. Please try again."
      );
    } finally {
      setIsSavingChanges(false);
    }
  };
  

  if (isSavingChanges) return <LoadingCat />;

  if (isRipModalVisible) {
    return (
      <View
        flex
        center
        style={{
          backgroundColor: ColorPalette.white,
          borderRadius: 20,
          padding: 30,
        }}
      >
        <View width={300} height={300} center>
          <Image
            source={require("@/assets/images/pawDust.webp")}
            width={"100%"}
            height={"100%"}
            resizeMode={"contain"}
          />
        </View>
        <View marginB-5 center width={"100%"}>
          <Text
            style={{
              fontSize: FontSize.large,
              fontFamily: Fonts.PoppinsBold,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Are you sure you want to mark this pet as passed away?
          </Text>
        </View>
        <View marginB-20 width={"100%"}>
          <Text
            style={{
              fontSize: FontSize.medium,
              fontFamily: Fonts.PoppinsRegular,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            You can't undo this action.
          </Text>
        </View>
        <View row style={{ width: "100%", justifyContent: "space-evenly" }}>
          <Button
            label="Close"
            labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
            backgroundColor={ColorPalette.bluePalette}
            onPress={() => setIsRipModalVisible(false)}
          />
          <Button
            label="It's no longer with us"
            color={Colors.grey40}
            labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
            backgroundColor={"transparent"}
            onPress={handleMarkAsPassedAway}
          />
        </View>
      </View>
    );
  }

  return (
    <View flex backgroundColor="white">
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

          <Text bold>
            Weight (kg)
          </Text>
          <SimpleTextField
            label="Weight"
            value={formData.weight}
            keyboardType="number-pad"
            onChangeText={(value) => handleChange("weight", value)}
          />

          <Text bold marginB-10>Size</Text>
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
                onPress={() => handleChange("height", option.value)}
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
        </View>
      </EditProfileLayout>
      <Button
        label={"Mark as passed away"}
        backgroundColor={Colors.white}
        color={Colors.grey30}
        labelStyle={{ fontFamily: Fonts.PoppinsLight, marginHorizontal: 10 }}
        style={{ alignSelf: "center", bottom: 30, elevation: 1 }}
        onPress={() => setIsRipModalVisible(true)}
      >
        <Ionicons name="flower-outline" size={24} color={Colors.grey30} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.white,
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
