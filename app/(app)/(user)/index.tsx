import { Link } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-ui-lib";

const Index = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Text>Hola</Text>
      <Link href={"/petRegister"} asChild>
        <Button label="Pet register" />
      </Link>
    </SafeAreaView>
  );
};

export default Index;
