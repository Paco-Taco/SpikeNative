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

  // if (authState?.authenticated == null) {
  //   return <Text>Loading...</Text>;
  // }

  if (!authState?.authenticated) {
    return <Redirect href={"/login"}/>
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
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
