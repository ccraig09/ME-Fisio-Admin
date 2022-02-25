import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MuscularComponent = () => {
  return (
    <View style={styles.container}>
      <Text>MuscularComponent</Text>
    </View>
  );
};

export default MuscularComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
