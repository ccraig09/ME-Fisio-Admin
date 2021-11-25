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

let screenHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const [selected, setSelected] = useState();

  // const onDayPress = (day) => {
  //   alert(day);
  //   setSelected(day.dateString);
  //   navigation.navigate("Slot", { bookingDate: day });
  // };

  return (
    <SafeAreaView style={styles.container}>
      <CalenderHome />
    </SafeAreaView>
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
