import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const InfoComponent = () => {
  const testList = [
    { title: "Informacion de Cliente", screen: "Info", key: 1 },
    { title: "Evaluacion Muscular", screen: "Muscular", key: 2 },
    ,
    { title: "Fecha Nacimiento", data: "21 de feb 1991", key: 3 },
    ,
    { title: "Lesion", data: "Rodilla derecha been huring for a min", key: 4 },
    { title: "Telefono", data: "+5911234567", key: 5 },
    { title: "Peso", data: "78 kilos", key: 6 },
    ,
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={testList}
          horizontal={false}
          keyExtractor={(item) => item.key}
          numColumns={3}
          renderItem={(itemData) => (
            <TouchableOpacity style={styles.details}>
              <Text style={styles.dataButtonTitle}>{itemData.item.title}</Text>
              <Text style={{ textAlign: "center", marginTop: 5, fontSize: 18 }}>
                {itemData.item.data}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default InfoComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    backgroundColor: Colors.primary,
    shadowColor: "black",
    shadowOpacity: 0.56,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 10,
    width: "45%",
  },
  dataButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
  },
});
