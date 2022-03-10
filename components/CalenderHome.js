import React, { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { Agenda } from "react-native-calendars";
import Colors from "../constants/Colors";
import { Avatar } from "react-native-elements";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { Appbar, Drawer } from "react-native-paper";

let screenHeight = Dimensions.get("window").height;
const CalenderHome = (props, { navigation }) => {
  const [selected, setSelected] = useState();
  const [userInfo, setUserInfo] = useState();
  const [reserves, setReserves] = useState();
  const [marks, setMarks] = useState();
  const [isLoading, setIsLoading] = useState();
  const [active, setActive] = useState("");

  // const things = {
  //   "2021-11-22": [{ name: "carlos", type: "Espalda" }],
  //   "2021-11-24": [
  //     { time: "9:00AM - 10:00AM", name: "Gabo", type: "Masaje" },
  //     { time: "10:00AM - 11:00AM", name: "Carlos", type: "Masaje" },
  //     { time: "11:00AM - 12:00AM", name: "Jeff", type: "Rehabilitacion" },
  //   ],
  //   "2021-11-25": [
  //     { time: "8:00AM - 9:00AM", name: "Kiki", type: "Rehabilitacion" },
  //   ],
  //   "2021-11-26": [],
  //   "2021-11-27": [
  //     { time: "10:00AM - 11:00AM", name: "Diego", type: "Masaje" },
  //   ],
  // };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      // const month = bookParam.bookingDate.month.toString();
      // const date = bookParam.bookingDate.dateString;
      // const year = bookParam.bookingDate.year.toString();

      const fetchMarkedDates = async () => {
        try {
          const list = [];
          let mark = {};
          await firebase
            .firestore()
            .collection(`Notifications`)
            .doc("Mayra")
            .collection("Marked Dates")
            .doc("marked")
            .get()
            .then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data());
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
      const fetchSlots = async () => {
        try {
          const list = [];
          let data;
          let mark = {};
          await firebase
            .firestore()
            .collection(`Notifications`)
            .doc("Mayra")
            .get()
            .then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data());

                setReserves(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };

      const fetchMembers = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { FirstName, LastName, Age, Cell } = doc.data();
                list.push({
                  key: doc.id,
                  Name: FirstName,
                  Last: LastName,
                  Cell: Cell,
                  Age: Age,
                });
              });
            });
          // console.log(list);
          setUserInfo(list);
        } catch (e) {
          console.log(e);
        }
      };
      fetchMarkedDates();
      fetchSlots();
      fetchMembers();
    }, [])
  );

  const refreshSlots = async () => {
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
            console.log("Document data:", doc.data());
            setReserves(doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        });
      // .then((querySnapshot) => {
      //   querySnapshot.forEach((doc) => {
      //     console.log("doc data loaded", doc.data());
      //     // const { userDataJson } = doc.data();

      //     // const keyss = Object.keys(doc.data().userDataJson);
      //     // console.log("i got the keys", keyss);
      //     // list.push(doc.id);

      //     // list.forEach((day) => {
      //     //   mark[day] = [
      //     //     {
      //     //       time: "9:00AM - 10:00AM",
      //     //       name: "carlos",
      //     //       type: "Rehabilitacion",
      //     //     },
      //     //   ];
      //     // });

      //     // list.push({
      //     //   date: doc.id,
      //     //   Data: userDataJson,
      //     // });
      //   });
      //   // console.log("listing", mark);
      //   setReserves(doc.data());
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const onDayPress = (day) => {
    const time = day.timestamp + 10 * 24 * 60 * 60 * 1000;
    dateStr(time);
    // alert(day.dateString);
    setSelected(day.dateString);
    console.log(day.dateString);
    // navigation.navigate("Slot", { bookingDate: day });
  };

  const dateStr = (time) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };

  return (
    <SafeAreaView
      style={{
        // marginTop: 25,
        flex: 1,
        // backgroundColor: Colors.primaryColor,
        padding: 5,
        paddingTop: 8,
        // alignItems: "center",
      }}
    >
      <Appbar.Header
        style={{
          width: "100%",
          //height:?
          // alignItems: "center",
          // alignContent: "center",
          justifyContent: "space-between",

          backgroundColor: "white",
          // borderBottomLeftRadius: 50,
        }}
      >
        <Appbar.Action
          icon="menu"
          color={Colors.primary}
          onPress={() => {
            props.drawerAction();
          }}
        />
        {/* <Drawer.Section title="Some title">
          <Drawer.Item
            label="First Item"
            active={active === "first"}
            onPress={() => setActive("first")}
          />
          <Drawer.Item
            label="Second Item"
            active={active === "second"}
            onPress={() => setActive("second")}
          />
        </Drawer.Section> */}
        {/* <Appbar.Action
          icon="arrow-left"
          color={Colors.primaryColor}
          onPress={() => navigation.goBack()}
        /> */}
        {/* <Avatar.Text size={24} label="XD" /> */}
        {/* <View style={{ alignContent: "center", alignItems: "center" }}> */}
        <Image
          style={styles.tinyLogo}
          source={require("../assets/mayraLogo.png")}
        />
        <Appbar.Action
          icon="refresh"
          color={Colors.primary}
          onPress={() => {
            props.drawerAction();
          }}
        />
        {/* <Appbar.Content
          // title="ME Fisio"
          titleStyle={{
            fontWeight: "bold",
            fontSize: 25,
            color: "white",
          }}
        /> */}
        {/* <Appbar.Action icon="dots-vertical" onPress={null} color={"white"} /> */}
        {/* title="ME Fisio"
          titleStyle={{
            fontWeight: "bold",
            fontSize: 25,
            color: "white",
          }} */}
        {/* /> */}
      </Appbar.Header>

      <Agenda
        onVisibleMonthsChange={(months) => {
          // console.log("now these months are visible", months);
        }}
        pastScrollRange={50}
        futureScrollRange={50}
        // scrollEnabled={true}
        showScrollIndicator={true}
        onDayPress={(day) => {
          onDayPress(day);
        }}
        items={
          reserves
          // "2021-11-22": [{ name: "carlos", type: "Espalda" }],
          // "2021-11-24": [
          //   { time: "9:00AM - 10:00AM", name: "Gabo", type: "Masaje" },
          //   { time: "10:00AM - 11:00AM", name: "Carlos", type: "Masaje" },
          //   { time: "11:00AM - 12:00AM", name: "Jeff", type: "Rehabilitacion" },
          // ],
          // "2021-11-25": [
          //   { time: "8:00AM - 9:00AM", name: "Kiki", type: "Rehabilitacion" },
          // ],
          // "2021-11-26": [],
          // "2021-11-27": [
          //   { time: "10:00AM - 11:00AM", name: "Diego", type: "Masaje" },
          // ],
        }
        style={styles.calendar}
        // hideExtraDays
        // markedDates={{ [selected]: { selected: true } }}

        markedDates={
          marks
          // // "2021-11-16": { selected: true, marked: true },
          // "2022-03-02": { marked: true },
          // "2022-03-03": { marked: true },
          // // "2021-11-20": { disabled: true },
          // // "2021-11-21": { disabled: true },
          // // "2021-11-27": { disabled: true },
        }
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
        }}
        onRefresh={() => {
          refreshSlots();
        }}
        renderItem={(item, firstItemInDay) => {
          return (
            <View style={styles.itemView}>
              <View>
                <TouchableOpacity
                  onPress={() => alert(item.Name, item.Time, item.Type)}
                >
                  <Text style={styles.itemTime}>{item.Time}</Text>
                  <Text style={styles.itemName}>
                    {item.Name} {item.Last}
                  </Text>
                  <Text style={styles.itemType}>{item.Type}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemAvatarView}>
                <Avatar
                  rounded
                  // avatarStyle={{backgroundColor: 'silver'}}
                  size={80}
                  activeOpacity={0.7}
                  // title={"cc"}
                  // title={`${
                  //   typeof userInfo.Nombre === 'undefined'
                  //     ? null
                  //     : userInfo.Nombre.charAt(0)
                  // }${
                  //   typeof userInfo.Apellido === 'undefined'
                  //     ? null
                  //     : userInfo.Apellido.charAt(0)
                  // }
                  // `}
                  icon={{ name: "user", type: "font-awesome" }}
                  source={{}}
                  containerStyle={{ backgroundColor: "silver" }}
                  // source={{ uri: `${userInfo.userImg}` }}
                  // onPress={() => {
                  //   navigation.navigate('EditClient', {
                  //     // clientData: selectedClient,
                  //   });
                  // }}
                ></Avatar>
              </View>
            </View>
          );
        }}
        renderEmptyData={() => {
          return (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>No Citas por hoy</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  itemView: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
    marginRight: 10,
    marginTop: 17,
    borderRadius: 10,
    padding: 10,
  },
  itemAvatarView: {
    justifyContent: "center",
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: screenHeight,
  },
  itemTime: {
    fontSize: 17,
    fontWeight: "400",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  itemType: {
    fontSize: 15,
    color: "grey",
  },
  tinyLogo: {
    width: 100,
    height: 50,
    alignSelf: "center",
    alignContent: "center",
  },
});

export default CalenderHome;
