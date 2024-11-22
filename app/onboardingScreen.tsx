import { View, Text, TouchableOpacity } from 'react-native-ui-lib'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, ImageBackground } from 'react-native';
import Spacing from '@/constants/Spacing';
import FontSize from '@/constants/FontSize';
import { ColorPalette } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

const { height } = Dimensions.get("window");

const OnboardingScreen = () => {
    return (
        <SafeAreaView>
          <View>
            {/* <ImageBackground
              style={{
                height: height / 2.5,
              }}
              resizeMode="contain"
              source={require("@/assets/images/pets.png")}
            /> */}
            <LottieView 
              source={require("@/assets/lottie/CatHiding.json")}
              autoPlay
              loop
              style={{
                height: height / 2.5,
              }}
            />
            <View
              style={{
                paddingHorizontal: Spacing * 4,
                paddingTop: Spacing * 4,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.xxLarge,
                  color: ColorPalette.primary,
                  fontFamily: Fonts.PoppinsBold,
                  textAlign: "center",
                }}
              >
                Find the perfect place for your pet
              </Text>
    
              <Text
                style={{
                  fontSize: FontSize.small,
                  color: ColorPalette.black,
                  fontFamily: Fonts.PoppinsRegular,
                  textAlign: "center",
                  marginTop: Spacing * 2,
                }}
              >
                Explore all the existing veterinaries based or your location and preferences
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 6,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => router.navigate("/login")}
                style={{
                  backgroundColor: ColorPalette.primary,
                  paddingVertical: Spacing * 1.5,
                  paddingHorizontal: Spacing * 2,
                  width: "48%",
                  borderRadius: Spacing,
                  shadowColor: ColorPalette.primary,
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsBold,
                    color: ColorPalette.white,
                    fontSize: FontSize.large,
                    textAlign: "center",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.navigate("/signUp")}
                style={{
                  paddingVertical: Spacing * 1.5,
                  paddingHorizontal: Spacing * 2,
                  width: "48%",
                  borderRadius: Spacing,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsBold,
                    color: ColorPalette.black,
                    fontSize: FontSize.large,
                    textAlign: "center",
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
}

export default OnboardingScreen