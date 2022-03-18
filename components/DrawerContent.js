import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Colors from "../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";

const DrawerContent = (props) => {
  const [clientList, setClientList] = useState([]);
  const [marks, setMarks] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchCoaches = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  FirstName,
                  LastName,
                  userImg,
                  Cell,
                  email,
                  Phone,
                  createdAt,
                  plan,
                  points,
                  startDate,
                  endDate,
                  expoPushToken,
                  goal,
                  history,
                  sport,
                  Age,
                  Height,
                  Weight,
                  Gender,
                  BaseStartDate,
                  Imc,
                  Grasa,
                  Musculo,
                  Basal,
                  GoalBasal,
                  Agua,
                  Proteina,
                  Osea,
                  Metabolica,
                  Viseral,
                  notes,
                  userId,
                } = doc.data();

                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  Cell: Cell,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  plan: plan,
                  expoPushToken: expoPushToken,
                  points: points,
                  startDate: startDate,
                  endDate: endDate,
                  goal: goal,
                  history: history,
                  sport: sport,
                  Age,
                  Height,
                  Weight,
                  Gender,
                  BaseStartDate,
                  Imc,
                  Grasa,
                  Musculo,
                  Basal,
                  GoalBasal,
                  Agua,
                  Proteina,
                  Osea,
                  Metabolica,
                  Viseral,
                  notes: notes,
                  createdAt: createdAt,
                  userId: userId,
                });
                // console.log("date diffs", dateDiff);
              });
            });
          console.log(list.length);
          // setClientList(list);
          setClientList(list.length);
        } catch (e) {
          console.log(e);
        }
      };
      // const fetchMarkedDates = async () => {
      //   try {
      //     const list = [];
      //     let mark = {};
      //     await firebase
      //       .firestore()
      //       .collection(`Notifications`)
      //       .doc("Mayra")
      //       // .collection("Marked Dates")
      //       // .doc("marked")
      //       .get()
      //       .then((querySnapshot) => {
      //         querySnapshot.forEach((doc) => {
      //           console.log("first", doc.data().Object.keys());
      //         });
      //         // var date1 = mo
      //       });
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };
      const fetchMarkedDates = async () => {
        try {
          const list = [];
          let mark = {};
          await firebase
            .firestore()
            .collection(`Notifications`)
            .doc("Mayra")
            .get()
            .then((doc) => {
              if (doc.exists) {
                setMarks(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };
      fetchCoaches();
      fetchMarkedDates();
    }, [])
  );

  console.log("drawer");
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: Colors.primary }}
      >
        <View
          // source={require("../assets/images/menu-bg.jpeg")}
          style={{ padding: 20 }}
        >
          <Image
            source={require("../assets/Mayyra.png")}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text style={styles.title}>Mayra Ameller</Text>
          <Text style={styles.caption}>Fisioterapeuta</Text>
          <View style={styles.row}>
            <View style={styles.section}>
              <Text style={[styles.paragraph, styles.caption]}>
                {clientList}
              </Text>
              <Text style={styles.caption}>Clientes</Text>
              <FontAwesome5 name="user-friends" size={14} color="#fff" />
            </View>
            <View style={styles.section}>
              <Text style={[styles.paragraph, styles.caption]}>
                {marks.TotalDates}
              </Text>
              <Text style={styles.caption}>Citas</Text>
              <FontAwesome5 name="calendar-alt" size={14} color="#fff" />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        {/* <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="share-social-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Roboto-Medium",
                marginLeft: 5,
              }}
            >
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Cerrar Sesión
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: "white",
    marginRight: 5,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerSectionBottom: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});

export default DrawerContent;
