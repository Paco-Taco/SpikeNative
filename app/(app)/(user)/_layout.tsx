import CustomHeader from "@/components/CustomHeader";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { Redirect, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const navigation = useNavigation();
  const { authState } = useAuth();

  if (!authState?.authenticated) {
    return <Redirect href={"/login"} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              header: () => <CustomHeader />,
            }}
          />
          <Stack.Screen
            name="petOwnerProfile"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="editPetOwnerProfile"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="petlist"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="petRegister"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="appointmentBooking/[veterinaryId]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
