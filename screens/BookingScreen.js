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
import { CalendarList } from "react-native-calendars";
import Colors from "../constants/Colors";

let screenHeight = Dimensions.get("window").height;

const BookingScreen = ({ navigation }) => {
  const [selected, setSelected] = useState();

  const onDayPress = (day) => {
    alert(day);
    setSelected(day.dateString);
    navigation.navigate("Slot", { bookingDate: day });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarList
        onVisibleMonthsChange={(months) => {
          // console.log("now these months are visible", months);
        }}
        pastScrollRange={50}
        futureScrollRange={50}
        scrollEnabled={true}
        showScrollIndicator={true}
        onDayPress={(day) => {
          onDayPress(day);
        }}
        style={styles.calendar}
        hideExtraDays
        markedDates={{ [selected]: { selected: true } }}
        markedDates={{
          "2021-11-16": { selected: true, marked: true },
          "2012-05-17": { marked: true },
          "2021-11-20": { disabled: true },
          "2021-11-21": { disabled: true },
          "2021-11-27": { disabled: true },
        }}
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
        }}
      />
      {/* <Calendar
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: screenHeight,
  },
});
export default BookingScreen;
