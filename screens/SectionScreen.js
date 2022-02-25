import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InfoComponent from "../components/InfoComponent";
import MuscularComponent from "../components/MuscularComponent";

const SectionScreen = ({ route, navigation }) => {
  const { section } = route.params;

  const selectedComponent = () => {
    if (section === "Info") {
      console.log("info");
      return <InfoComponent />;
    }
    if (section === "Muscular") {
      console.log("muscle");
      return <MuscularComponent />;
    }
  };
  return selectedComponent();
};

export default SectionScreen;

const styles = StyleSheet.create({});
