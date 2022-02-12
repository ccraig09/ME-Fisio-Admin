import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
// import styles from '../../components/commonstyle'
// import { CalendarList } from "react-native-calendars";
import CalenderHome from "../components/CalenderHome";
import Colors from "../constants/Colors";
import { useRoute } from "@react-navigation/native";
// import { DrawerContent } from "../components/DrawerContent";

let screenHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const route = useRoute();
  console.log(route.name);
  // <DrawerContent screenName={route.name} />;

  const [selected, setSelected] = useState();

  // const onDayPress = (day) => {
  //   alert(day);
  //   setSelected(day.dateString);
  //   navigation.navigate("Slot", { bookingDate: day });
  // };

  return (
    // <SafeAreaView style={styles.container}>
    <CalenderHome
      drawerAction={() => {
        navigation.openDrawer();
      }}
    />
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  // calendar: {
  //   borderTopWidth: 1,
  //   paddingTop: 5,
  //   borderBottomWidth: 1,
  //   borderColor: "#eee",
  //   height: screenHeight,
  // },
});
export default HomeScreen;
