// App.js — ponto de entrada: monta o Provider do tema e a navegação.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { ThemeProvider, useTema } from './src/ThemeContext';
import BuscaScreen from './src/screens/BuscaScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';

const Tab = createBottomTabNavigator();

// Componente interno: precisa existir para poder LER o tema,
// porque quem lê o Context tem que estar DENTRO do Provider.
function Navegacao() {
  const { tema } = useTema();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tema.cores.primaria,
          tabBarInactiveTintColor: tema.cores.textoSecundario,
          tabBarStyle: {
            backgroundColor: tema.cores.card,
            borderTopColor: tema.cores.borda,
          },
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

export default function App() {
  return (
    <ThemeProvider>
      <Navegacao />
    </ThemeProvider>
  );
}