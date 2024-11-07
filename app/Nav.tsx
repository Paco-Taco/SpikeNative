import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './(app)/(register)/register';
import VetDetailsScreen from './(app)/(register)/(registerVet)/vetDetails';  
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VetDetailsScreen" component={VetDetailsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
