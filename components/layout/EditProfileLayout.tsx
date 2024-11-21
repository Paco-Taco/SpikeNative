import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native-ui-lib";
import BackArrow from "../shared/BackArrow";
import DoneCheckMark from "../shared/DoneCheckMark";

const EditProfileLayout = ({
  handleSubmit,
  disabledWhen,
  children
}: {
  handleSubmit: () => void;
  disabledWhen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View row style={{ justifyContent: "space-between", padding: 10 }}>
          <BackArrow />
          <DoneCheckMark onPress={handleSubmit} disabled={disabledWhen} />
        </View>
        <View style={styles.container}>
            {children}
        </View>
      </ScrollView>
    </SafeAreaView>
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

export default EditProfileLayout;
