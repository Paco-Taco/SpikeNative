import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  InteractionManager,
  StatusBar,
} from "react-native";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { useLoginStore } from "@/stores/login.store";
import { Roles } from "@/constants/Roles";
import {
  Text,
  View,
  Image,
  Colors,
  TextField,
  Button,
} from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyBoardAvoidWrapper from "@/components/KeyBoardAvoidWrapper";
import LoadingCat from "@/components/shared/LoadingCat";
import LottieView from "lottie-react-native";
import { Fonts } from "@/constants/Fonts";
import { isValidEmail } from "@/utils/isValidEmail";

const Login = () => {
  const { onLogin, authState } = useAuth();
  const { dataLogin } = useLoginStore((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animación de lottie
  const animationRef = useRef<LottieView>(null);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1); // 1 para adelante, -1 para atrás

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const loadSession = () => {
      const role = dataLogin?.user.role;
      console.log(role)

      if (
        authState?.authenticated !== null &&
        authState?.authenticated &&
        authState?.token
      ) {
        if (role === Roles.user) {
          router.replace("/(app)/(user)");
        } else if (role === Roles.veterinary) {
          router.replace("/(app)/(vet)");
        }
      }
    };
    loadSession();
  }, [authState?.authenticated, dataLogin]);

  const login = async () => {
    try {
      setIsLoading(true);
      await onLogin!({ email, password });

      const role = dataLogin?.user.role;
      if (role === Roles.user) {
        router.replace("/(app)/(user)");
      } else if (role === Roles.veterinary) {
        router.replace("/(app)/(vet)");
      }

      InteractionManager.runAfterInteractions(() => {
        setIsLoading(false);
      });
    } catch (error) {
      setTimeout(() => {
        alert(error);
      }, 2000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // Efecto boomerang
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + direction * 0.01; // Cambiar progreso por iteración
        if (nextProgress >= 1) {
          setDirection(-1); // Cambiar dirección hacia atrás
          return 1; // Límite superior
        } else if (nextProgress <= 0) {
          setDirection(1); // Cambiar dirección hacia adelante
          return 0; // Límite inferior
        }
        return nextProgress;
      });
    }, 16); // Aproximadamente 60fps

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [direction]);

  const isFormValid = () => {
    return email.length > 0 && password.length > 0 && password.length >= 6;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorPalette.background }}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={ColorPalette.white}
      />

      {isLoading ? (
        <LoadingCat />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={"handled"}
          >
            <View flex style={styles.imageContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
              />
              <Text semiBold style={styles.title}>
                Spike
              </Text>
            </View>
            <LottieView
              ref={animationRef}
              source={require("@/assets/lottie/CatHiding.json")}
              style={{
                height: 200,
                marginTop: "50%",
                width: 200,
                alignSelf: "center",
              }}
              progress={progress}
            />
            <View flex padding-30 style={styles.formContainer}>
              <Text bold style={styles.title}>
                Login
              </Text>
              <View centerV flex>
                <TextField
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={ColorPalette.medium}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Password"
                    placeholderTextColor={ColorPalette.medium}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={togglePasswordVisibility}
                  >
                    <MaterialCommunityIcons
                      name={passwordVisible ? "eye-off" : "eye"}
                      size={24}
                      color={ColorPalette.medium}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    disabled={!isFormValid()}
                    style={styles.button}
                    onPress={login}
                    backgroundColor={ColorPalette.primary}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </Button>
                  <TouchableOpacity onPress={() => router.push("/signUp")}>
                    <Text style={styles.linkText}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.darkGrayPalette,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    top: 60,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: Colors.grey60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.PoppinsBold,
    textAlign: "center",
    padding: 10,
    color: ColorPalette.darkGrayPalette,
  },
  input: {
    height: 50,
    borderColor: Colors.grey50,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: ColorPalette.white,
    color: ColorPalette.mediumDark,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    borderColor: Colors.grey50,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: ColorPalette.white,
    color: ColorPalette.mediumDark,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: ColorPalette.lightGrey,
    fontSize: 16,
    fontFamily: Fonts.PoppinsBold,
  },
  linkText: {
    color: ColorPalette.medium,
    fontSize: 14,
    textAlign: "center",
  },
});

export default Login;
