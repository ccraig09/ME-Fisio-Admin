import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  useEffect,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const ReviewScreen = ({ navigation }) => {
  setTimeout(() => {
    navigation.navigate("Clients");
  }, 3000);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        // style={{
        //   width: 400,
        //   height: 400,
        //   backgroundColor: "#eee",
        // }}
        source={require("../assets/lottie/93507-check.json")}
        autoPlay
        loop={false}
      />
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({});
