import React from "react";
import {
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";

const ClassStartItem = (props) => {
  let logoimg = "../assets/icon-noexlogo.png";

  const Bullet = () => {
    var INFO = props.info;
    // renderRow(data);
    const data = INFO.map((list) => list.INFO);
    return (
      <View style={{ flexDirection: "row" }}>
        <Text>{"\u2022"}</Text>
        <Text style={{ flex: 1, paddingLeft: 5 }}>{data}</Text>
      </View>
    );
  };

  return (
    <View style={styles.Container}>
      <StatusBar hidden />
      <View style={styles.Cover}>
        <Image style={styles.Image} source={props.image} />
        {/* <Image style={styles.Image} source={{ uri: props.image }} /> */}
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.caption}>{props.subtitle}</Text>
        {/* <Text style={styles.subtitle}>{bullet}</Text> */}
        <FlatList
          // style={styles.questionOptions}
          data={props.info}
          // contentContainerStyle={styles.questionOptionsContainer}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{"\u2022"}</Text>
              <Text style={{ flex: 1, paddingLeft: 5, fontSize: 20 }}>
                {item}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => `${index}-${item}`}
          // onPressItem={handleSelection(item)}
          scrollEnabled={true}
        />
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => {
            props.onVideoClick();
          }}
        >
          <Text style={styles.panelButtonTitle}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Cover: {
    height: 375,
  },
  Image: {
    width: "100%",
    height: "100%",
    // position: "absolute",
  },
  PlayWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40,
    marginLeft: -40,
  },
  wrapper: {
    marginLeft: 10,
  },
  caption: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: "open-sans-bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "grey",
    fontWeight: "600",
    fontSize: 15,
    textTransform: "uppercase",
    marginTop: 4,
  },
  PlayView: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  Wrapper: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 20,
    alignItems: "center",
  },
  Logo: {
    width: 24,
    height: 24,
  },
  Subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 15,
    width: 200,
  },
  panelButtonTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
  },
});

export default ClassStartItem;
