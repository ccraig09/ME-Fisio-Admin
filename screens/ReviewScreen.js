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
  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate("Home");
  //   }, 3000);
  // }, []);

  setTimeout(() => {
    navigation.navigate("Home");
  }, 4000);
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <LottieView
        source={require("../assets/lottie/81484-confirmation-spinner.json")}
        autoPlay
        loop={false}
      />
      {/* <Button
        title="go back"
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({});
