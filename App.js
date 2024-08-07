import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Product from './screens/Product';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false  }} />
        <Stack.Screen name="Product" component={Product} options={{ headerShown: false  }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
