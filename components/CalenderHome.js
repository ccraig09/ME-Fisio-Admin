import React, { Component, useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  StatusBar,
  SafeAreaView,
  Alert,
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
import * as Calendar from "expo-calendar";
import moment from "moment";

let screenHeight = Dimensions.get("window").height;
const CalenderHome = (props, { navigation }) => {
  const [selected, setSelected] = useState();
  const [userInfo, setUserInfo] = useState();
  const [reserves, setReserves] = useState();
  const [marks, setMarks] = useState();
  const [isLoading, setIsLoading] = useState();
  const [active, setActive] = useState("");
  const [friendNameText, setFriendNameText] = useState("loso cal test");
  const [selectedStartDate, setSelectedStartDate] =
    useState("1995-12-1T03:24:00");
  const [selectedEndDate, setSelectedEndDate] = useState("2022-03-18T20:00:00");

  // const startDate = selectedStartDate ? selectedStartDate : "";
  const startDate = "2022-03-18T19:49:00";
  const endDate = selectedEndDate ? selectedEndDate : "";

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        // console.log("Here are all your calendars:");
        // console.log({ calendars });
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    console.log(defaultCalendar);
    return defaultCalendar.id;
    // const calendars = await Calendar.getCalendarsAsync();
    // const defaultCalendars = calendars.filter(
    //   (each) => each.source.name === "iCloud" // or 'iCloud', 'Yahoo'
    // );
    // return defaultCalendars[0].source;
    //   const calendars = await Calendar.getCalendarsAsync(
    //     Calendar.EntityTypes.EVENT
    //   );
    //   const defaultCalendars = calendars.filter(
    //     (each) => each.source.name === "Default"
    //   );
    //   return defaultCalendars.length
    //     ? defaultCalendars[0].source
    //     : calendars[0].source;
  }

  async function createCalendar() {
    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Expo Calendar" };

    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Expo Calendar",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(newCalendarID);

    // console.log(`Your new calendar ID is: ${defaultCalendarSource}`);
    // return defaultCalendarSource;
    return newCalendarID;
  }

  const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();

      const res = await Calendar.createEventAsync(calendarId, {
        startDate: moment(startDate).add(0, "m").toDate(),
        endDate: moment(endDate).add(0, "m").toDate(),
        title: "Cita con Carlos Craig ",
        notes: "Masaje",
        alarms: [{ relativeOffset: -1440 }, { relativeOffset: -60 }],
      });
      console.log("first", res);
      Alert.alert("Event Created!", res);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteEvent = async () => {
    Calendar.deleteEventAsync("4722E166-2703-48CE-90C6-67B14A13B1DC");
    Alert.alert("Event Deleted!");
  };
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
            .collection(`Data`)
            .doc("Mayra")
            .collection("Marked Dates")
            .doc("marked")
            .get()
            .then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", Object.keys(doc.data()).length);
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
            .collection(`Data`)
            .doc("Mayra")
            .collection(`Slots`)
            .doc("Mayra")
            // .orderBy("Time", "desc")
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
        .collection(`Data`)
        .doc("Mayra")
        .collection(`Slots`)
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
      setUserInfo(list);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMarkedDates = async () => {
    try {
      const list = [];
      let mark = {};
      await firebase
        .firestore()
        .collection(`Data`)
        .doc("Mayra")
        .collection("Marked Dates")
        .doc("marked")
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", Object.keys(doc.data()).length);
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

  const refreshHandler = async () => {
    fetchMarkedDates();
    refreshSlots();
    fetchMembers();
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
            refreshHandler();
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
      <Button title="Create a new calendar" onPress={createCalendar} />
      <Button title="Add a new calendar" onPress={addNewEvent} />
      <Button title="Delete Event" onPress={deleteEvent} />

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
