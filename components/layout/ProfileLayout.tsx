import { View, Text, Avatar, Button, TouchableOpacity } from "react-native-ui-lib";
import React, { ReactNode } from "react";
import { ColorPalette } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogOutButton from "../shared/LogOutButton";
import { Link, useNavigation } from "expo-router";
import { Fonts } from "@/constants/Fonts";
import { useLoginStore } from "@/stores/login.store";

const ProfileLayout = ({
  userImg,
  userName,
  email,
  editHref,
  children,
}: {
  userImg: string;
  userName: string;
  email: string;
  editHref: string;
  children: ReactNode
}) => {
  const navigation = useNavigation()
  return (
  <SafeAreaView style={styles.safeArea}>
    <View style={{top: 10, left: 20,}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={ColorPalette.medium} />  
      </TouchableOpacity>
    </View>
    <View style={styles.container} gap-20 padding-20>
      <View center width={"100%"}>
        {userImg ? (
          <Avatar source={{ uri: userImg }} animate size={100} />
        ) : (
          <Avatar
            source={{ uri: require("@/assets/images/catbox.png") }}
            size={100}
          />
        )}

        <Text style={styles.profileName} marginT-20>
          {userName}
        </Text>

        <Text style={{ fontFamily: Fonts.PoppinsLight }}>{email}</Text>

        <Link asChild href={editHref as any}>
          <Button
            label="Edit profile"
            backgroundColor={ColorPalette.white}
            outlineColor={ColorPalette.black}
            color={ColorPalette.black}
            labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
            size="medium"
            marginT-20
          />
        </Link>
      </View>
      {/* <View width={'100%'} center row padding-10>
        {user?.category.map((category, index) => (
          <Badge
            key={index}
            label={category}
            size={30}
            labelStyle={{
              padding: 5,
              color:
                category === Categories.NUTRITION
                  ? ColorPalette.green
                  : category === Categories.RECREATION
                  ? ColorPalette.yellowText
                  : ColorPalette.bluePalette,
            }}
            backgroundColor={
              category === Categories.NUTRITION
                ? ColorPalette.greenLow
                : category === Categories.RECREATION
                ? ColorPalette.yellowLow
                : ColorPalette.blueLow
            }
            marginR-5
          />
        ))}
      </View> */}

      <View>
        {children}
      </View>
    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.white,
  },
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    // marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: ColorPalette.darkGrayPalette,
  },
});

export default ProfileLayout;
