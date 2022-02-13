import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/HomeScreen";
import Details from "../screens/DetailsScreen";
import Pdf from "../screens/PdfScreen";
import Notifications from "../screens/NotificationsScreen";
import Booking from "../screens/BookingScreen";
import Slot from "../screens/SlotScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Colors from "../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientListScreen from "../screens/ClientListScreen";
import DrawerContent from "../components/DrawerContent";
import TabNavigator from "./TabNavigator";

// import Login from '../src/screens/login';
// import Signup from '../src/screens/signup';
// import Preguntas from '../src/screens/preguntas';
// import Wheels from '../src/screens/wheels';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.primary,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
      initialRouteName="Inicio"
    >
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Exportar"
        component={Pdf}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="share-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notications"
        component={Notifications}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Informacion"
        component={Booking}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
// const ClientStack = () => (
//   <Stack.Navigator>
//     {/* <Stack.Navigator initialRouteName="Home"> */}
//     <Stack.Screen
//       name="Clients"
//       component={ClientListScreen}
//       options={({ navigation }) => ({
//         title: "",
//         headerShown: false,
//       })}
//     />
//     {/* <Stack.Screen
//       name="Client"
//       component={ClientDetailsScreen}
//       options={({ navigation }) => ({
//         title: "Cliente Detalles",
//         headerShown: true,
//       })}
//     />
//     <Stack.Screen
//       name="EditClient"
//       component={EditClientScreen}
//       options={({ navigation }) => ({
//         title: "Editar Cliente",
//         headerShown: true,
//       })}
//     /> */}
//   </Stack.Navigator>
// );

// const AppStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="HomeTabs"
//         component={HomeTabs}
//         options={{
//           headerShown: true,
//           animation: "fade",
//           title: "Citas",
//           headerShown: false,
//           headerTintColor: "#25a2d5",
//         }}
//       />
//       <Stack.Screen
//         name="Details"
//         component={Details}
//         options={{ headerShown: true, animation: "fade" }}
//       />
//       <Stack.Screen
//         name="Pdf"
//         component={Pdf}
//         options={{ headerShown: true, animation: "fade" }}
//       />
//       <Stack.Screen
//         name="booking"
//         component={Booking}
//         options={{ headerShown: true, animation: "fade" }}
//       />
//       <Stack.Screen
//         name="Slot"
//         component={Slot}
//         options={{ headerShown: true, animation: "fade" }}
//       />
//       {/*
//       <Stack.Screen
//         name="Signup"
//         component={Signup}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen name="Wheels" component={Wheels} />
//       <Stack.Screen name="Preguntas" component={Preguntas} /> */}
//     </Stack.Navigator>
//   );
// };
export default AppStack;
