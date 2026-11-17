import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold, Fraunces_800ExtraBold } from '@expo-google-fonts/fraunces';
import { AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible';
import { AppProvider } from './src/state';
import { C, F } from './src/theme';
import { IconBtn } from './src/ui';
import { Splash, Perfil, NovaDoacao, Acompanhar, Oferta, Rota, Acess } from './src/screens';
import {
  Onboarding, EmpresaInicio, EmpresaDoacoes, Plano, Impacto, Comprovante,
  OngOfertas, OngChegadas, OngEstoque, OngPerfil,
  MotoristaRotas, MotoristaHistorico, MotoristaDocs, Ocorrencia,
  Cidadao, Cozinha, Notificacoes,
} from './src/screens2';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const acoes = (navigation, notif) => () => (
  <View style={{ flexDirection: 'row' }}>
    {notif && <IconBtn name="notifications-outline" label="Notificações" onPress={() => navigation.navigate('Notificacoes')} />}
    <IconBtn name="accessibility-outline" label="Acessibilidade" onPress={() => navigation.navigate('Acessibilidade')} />
  </View>
);

const trocar = (navigation) => () => (
  <IconBtn name="swap-horizontal" label="Trocar perfil" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Perfil' }] })} />
);

const base = ({ navigation }) => ({ headerRight: acoes(navigation, false) });
const home = ({ navigation }) => ({ headerRight: acoes(navigation, true), headerBackVisible: false, headerLeft: trocar(navigation) });

const tabs = (itens) =>
  function Tabs() {
    const ins = useSafeAreaInsets();
    return (
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          ...home({ navigation }),
          headerStyle: { backgroundColor: C.creme },
          headerTintColor: C.verde,
          headerTitleStyle: { fontFamily: F.sub },
          headerShadowVisible: false,
          tabBarActiveTintColor: C.verde,
          tabBarInactiveTintColor: C.carvao,
          tabBarStyle: { backgroundColor: C.creme, height: 66 + ins.bottom, paddingTop: 6, paddingBottom: 4 + ins.bottom },
          tabBarLabelStyle: { fontFamily: F.negrito, fontSize: 14 },
        })}
      >
        {itens.map(([name, comp, label, icon]) => (
          <Tab.Screen
            key={name}
            name={name}
            component={comp}
            options={{ title: label, tabBarLabel: label, tabBarIcon: ({ color }) => <Ionicons name={icon} size={24} color={color} /> }}
          />
        ))}
      </Tab.Navigator>
    );
  };

const EmpresaTabs = tabs([
  ['Inicio', EmpresaInicio, 'Início', 'home-outline'],
  ['Doacoes', EmpresaDoacoes, 'Doações', 'list-outline'],
  ['Plano', Plano, 'Plano', 'card-outline'],
  ['Impacto', Impacto, 'Impacto', 'leaf-outline'],
]);
const OngTabs = tabs([
  ['Ofertas', OngOfertas, 'Ofertas', 'gift-outline'],
  ['Chegadas', OngChegadas, 'Chegadas', 'car-outline'],
  ['Estoque', OngEstoque, 'Estoque', 'cube-outline'],
  ['PerfilOng', OngPerfil, 'Perfil', 'business-outline'],
]);
const MotoristaTabs = tabs([
  ['Rotas', MotoristaRotas, 'Rotas', 'navigate-outline'],
  ['Historico', MotoristaHistorico, 'Histórico', 'time-outline'],
  ['Docs', MotoristaDocs, 'Documentos', 'document-text-outline'],
]);

export default function App() {
  const [ok, err] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_800ExtraBold,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });
  if (!ok && !err) return null;
  return (
    <SafeAreaProvider>
    <AppProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: C.creme },
            headerTintColor: C.verde,
            headerTitleStyle: { fontFamily: F.sub },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={Perfil} options={({ navigation }) => ({ ...base({ navigation }), title: 'Full Plate', headerBackVisible: false })} />
          <Stack.Screen name="EmpresaTabs" component={EmpresaTabs} options={{ headerShown: false }} />
          <Stack.Screen name="OngTabs" component={OngTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MotoristaTabs" component={MotoristaTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cidadao" component={Cidadao} options={(p) => ({ ...home(p), title: 'Cidadão' })} />
          <Stack.Screen name="Cozinha" component={Cozinha} options={(p) => ({ ...base(p), title: 'Cozinha solidária' })} />
          <Stack.Screen name="NovaDoacao" component={NovaDoacao} options={(p) => ({ ...base(p), title: 'Nova doação' })} />
          <Stack.Screen name="Acompanhar" component={Acompanhar} options={(p) => ({ ...base(p), title: 'Acompanhar doação' })} />
          <Stack.Screen name="Comprovante" component={Comprovante} options={(p) => ({ ...base(p), title: 'Comprovante' })} />
          <Stack.Screen name="Oferta" component={Oferta} options={(p) => ({ ...base(p), title: 'Oferta' })} />
          <Stack.Screen name="Rota" component={Rota} options={(p) => ({ ...base(p), title: 'Rota' })} />
          <Stack.Screen name="Ocorrencia" component={Ocorrencia} options={(p) => ({ ...base(p), title: 'Ocorrência' })} />
          <Stack.Screen name="Notificacoes" component={Notificacoes} options={{ title: 'Notificações' }} />
          <Stack.Screen name="Acessibilidade" component={Acess} options={{ title: 'Acessibilidade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
    </SafeAreaProvider>
  );
}
