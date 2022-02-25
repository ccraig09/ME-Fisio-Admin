import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import Home from "../screens/HomeScreen";
import Details from "../screens/DetailsScreen";
import Pdf from "../screens/PdfScreen";
import Booking from "../screens/BookingScreen";
import Slot from "../screens/SlotScreen";
import Colors from "../constants/Colors";

import Icon from "react-native-vector-icons/Ionicons";
import ClientListScreen from "../screens/ClientListScreen";
import ClientDetailsScreen from "../screens/ClientDetailsScreen";
import EditClientScreen from "../screens/EditClientScreen";
import SectionScreen from "../screens/SectionScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => ({
          tabBarLabel: "Citas",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="ios-calendar" color={color} size={30} />
            ) : (
              <Icon name="ios-calendar" color={color} size={26} />
            ),
        })}
      />
      <Tab.Screen
        name="Clientes"
        component={ClientStack}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="people" color={color} size={30} />
            ) : (
              <Icon name="people" color={color} size={26} />
            ),
        }}
      />
      {/*  <Tab.Screen
        name="Informacion"
        component={InformationStack}
        options={{
          tabBarLabel: "Informacion",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="information-circle" color={color} size={30} />
            ) : (
              <Icon name="information-circle" color={color} size={26} />
            ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

const ClientStack = () => (
  <Stack.Navigator>
    {/* <Stack.Navigator initialRouteName="Home"> */}
    <Stack.Screen
      name="Clients"
      component={ClientListScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="Client"
      component={ClientDetailsScreen}
      options={({ navigation }) => ({
        title: "Cliente Detalles",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="EditClient"
      component={EditClientScreen}
      options={({ navigation }) => ({
        title: "Editar Cliente",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="Section"
      component={SectionScreen}
      options={({ navigation }) => ({
        title: "Secion",
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: true,
          animation: "fade",
          title: "Citas",
          headerShown: false,
          headerTintColor: "#25a2d5",
        }}
      />
      {/* <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerShown: true, animation: "fade" }}
      />
      <Stack.Screen
        name="Pdf"
        component={Pdf}
        options={{ headerShown: true, animation: "fade" }}
      />
      <Stack.Screen
        name="booking"
        component={Booking}
        options={{ headerShown: true, animation: "fade" }}
      />
      <Stack.Screen
        name="Slot"
        component={Slot}
        options={{ headerShown: true, animation: "fade" }}
      /> */}
      {/* 
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Wheels" component={Wheels} />
      <Stack.Screen name="Preguntas" component={Preguntas} /> */}
    </Stack.Navigator>
  );
};

export default HomeTabs;
