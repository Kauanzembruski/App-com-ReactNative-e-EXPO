// App.js — ponto de entrada: monta o Provider do tema e a navegação.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { ThemeProvider, useTema } from './src/ThemeContext';
import BuscaScreen from './src/screens/BuscaScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetalhesScreen from './src/screens/DetalhesScreen';

const Stack = createNativeStackNavigator();
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
          component={PilhaBusca}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritosScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" color={color} size={size} />
            ),
          }}
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

function PilhaBusca() {
  const { tema } = useTema();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.card },
        headerTintColor: tema.cores.textoPrincipal,
      }}
    >
      <Stack.Screen name="Busca" component={BuscaScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen}
        options={{ title: 'Detalhes do filme' }} />
    </Stack.Navigator>
  );
}