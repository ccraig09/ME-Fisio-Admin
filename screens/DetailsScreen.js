import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CategoryItem from "../components/CategoryItem";
import ClassStartItem from "../components/ClassStartItem";

const DetailsScreen = ({ route, navigation }) => {
  const [Level1, setLevel1] = useState([]);

  const { service } = route.params;
  //   console.log("section", data);
  //   console.log("and this the key", classId);

  //   console.log(
  //     "did i find it?",
  //     data.find((key) => key.key === classId)
  //   );
  //   setLevel1(data);
  return (
    <ClassStartItem
      image={service.Image}
      subtitle={service.Subtitle}
      description={service.subDetail}
      info={service.info}
      onVideoClick={() => {
        navigation.navigate("booking");
      }}
    />
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
});

export default DetailsScreen;
