import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./Screens/LoginScreen";
import InicioSesion from "./Screens/InicioSesion";
import Registro from "./Screens/Registro";
import RecuperarContraseña from "./Screens/RecuperarContraseña";
import Menu from "./Screens/MenuScreens";
import Gestion from "./Screens/GestionDeTransacciones";
import Graficas from "./Screens/Graficas";
import Apartados from "./Screens/PresupuestosMensuales";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") iconName = "home";
          else if (route.name === "Transacciones") iconName = "wallet";
          else if (route.name === "Graficas") iconName = "bar-chart";
          else if (route.name === "Presupuestos") iconName = "cash";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Menu} />
      <Tab.Screen name="Transacciones" component={Gestion} />
      <Tab.Screen name="Graficas" component={Graficas} />
      <Tab.Screen name="Presupuestos" component={Apartados} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Recuperar" component={RecuperarContraseña} />
        <Stack.Screen name="MainApp" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
