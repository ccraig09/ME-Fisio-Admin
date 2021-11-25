import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  SafeAreaView,
} from "react-native";
import Colors from "../constants/Colors";

const CategoryItem = (props) => {
  let logoimg = "../assets/mayraLogo.png";
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <SafeAreaView>
      <View style={styles.product}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onClassClick} useForeground>
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={props.image}
                  // source={{ uri: props.image }}
                />
              </View>
              {/* <View style={styles.details}> */}
              {/* <Image style={styles.logo} source={require(logoimg)} /> */}
              <View style={styles.wrapper}>
                <View style={styles.levelWrapper}>
                  <Text style={styles.subtitle}>{props.subtitle}</Text>
                  <Text style={styles.subDetail}>{props.subDetail}</Text>
                  {/* <Text style={styles.caption}>Tiempo: {props.time}</Text> */}
                </View>
                <View style={styles.level}>
                  {/* <Text style={styles.difficulty}> - {props.difficulty}</Text> */}
                </View>
              </View>
              {/* </View> */}
            </View>
          </TouchableCmp>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  product: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    height: 200,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "72%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  subtitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "open-sans-bold",
    marginTop: 4,
  },
  subDetail: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "open-sans",
    marginBottom: 5,
  },
  caption: {
    color: "#b8bece",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "open-sans-bold",
    textTransform: "uppercase",
    // marginTop: 1,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 2,
  },
  wrapper: {
    flexDirection: "row",
    height: "30%",
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  level: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 50,
    height: 50,
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888",
  },
  difficulty: {
    color: "white",
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    height: "30%",
    paddingLeft: 20,
  },
  levelWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});

export default CategoryItem;
