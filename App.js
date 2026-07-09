// App.js — ponto de entrada: só monta a navegação.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import BuscaScreen from './src/screens/BuscaScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,          // nossas telas já têm título próprio
          tabBarActiveTintColor: '#2563EB',
        }}
      >
        <Tab.Screen
          name="Buscar"
          component={BuscaScreen}
          options={{ tabBarIcon: () => <Text>🔍</Text> }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritosScreen}
          options={{ tabBarIcon: () => <Text>⭐</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}