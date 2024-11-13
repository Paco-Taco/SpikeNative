import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  InteractionManager,
} from "react-native";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { useLoginStore } from "@/stores/login.store";
import { Roles } from "@/constants/Roles";
import { Text, View, Image } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyBoardAvoidWrapper from "@/components/KeyBoardAvoidWrapper";
import LoadingCat from "@/components/shared/LoadingCat";

const Login = () => {
  const { onLogin, authState } = useAuth();
  const { dataLogin } = useLoginStore((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  useEffect(() => {
    const loadSession = () => {
      setIsLoading(true);
      const role = dataLogin?.user.role;

      if (
        authState?.authenticated !== null &&
        authState?.authenticated &&
        authState?.token
      ) {
        if (role === Roles.user) {
          router.replace("/(app)/(user)/");
        } else if (role === Roles.veterinary) {
          router.replace("/(app)/(vet)/");
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 2000)
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
        router.replace("/(app)/(user)/");
      } else if (role === Roles.veterinary) {
        router.replace("/(app)/(vet)/");
      }
      
      InteractionManager.runAfterInteractions(() => {
        setIsLoading(false)
      })
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

  return (
    <SafeAreaView
      style={{ flex: 2, backgroundColor: ColorPalette.darkGrayPalette }}
    >
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
            <View flex padding-20 style={styles.formContainer}>
              <Text bold style={styles.title}>
                Login
              </Text>
              <View centerV flex>
                <TextInput
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
                  <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
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
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: ColorPalette.graphitePalette,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    padding: 10,
    color: ColorPalette.lightGrey,
  },
  input: {
    height: 50,
    borderColor: ColorPalette.lightGraphite,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: ColorPalette.lightGraphite,
    color: ColorPalette.lightGrey,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    borderColor: ColorPalette.lightGraphite,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: ColorPalette.lightGraphite,
    color: ColorPalette.lightGrey,
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
    backgroundColor: ColorPalette.bluePalette,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: ColorPalette.lightGrey,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: ColorPalette.medium,
    fontSize: 14,
    textAlign: "center",
  },
});

export default Login;