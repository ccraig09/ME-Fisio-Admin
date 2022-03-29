import React, {
  Component,
  useState,
  useContext,
  useEffect,
  createRef,
} from "react";
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
import { Appbar } from "react-native-paper";
import * as Calendar from "expo-calendar";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-tiny-toast";

const actionSheetRef = createRef();

let screenHeight = Dimensions.get("window").height;
const CalenderHome = (props, { navigation }) => {
  const { deleteEventFB, deleteButton } = useContext(AuthContext);
  const [selected, setSelected] = useState();
  const [userInfo, setUserInfo] = useState();
  const [data, setData] = useState();
  const [reserves, setReserves] = useState();
  const [dateKeys, setDateKeys] = useState();
  const [marks, setMarks] = useState();
  const [actualMarks, setActualMarks] = useState();
  const [isLoading, setIsLoading] = useState();
  const [active, setActive] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
      }
    })();
  }, []);

  const deletePrompt = async (value) => {
    Alert.alert("Borrar Evento?", "Quiere borrar este evento?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          deleteEventHandler(value);
        },
      },
    ]);
  };

  const deleteEventHandler = async (value) => {
    const toast = await Toast.showLoading("Borrando Evento");

    await deleteEventFB(value, "Mayra");
    //delete from homescreen
    //marked dates?
    await deleteEvent(value.calRes);
    Toast.hide(toast);
    SheetManager.hide("actionSheetRef");

    refreshHandler();
  };

  const deleteEvent = async (id) => {
    Calendar.deleteEventAsync(id);
    Alert.alert("Evento Borrado!");
  };
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      let playDates;
      let playMarks;
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
                // console.log("Document data:", doc.data());
                playMarks = doc.data();
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
          let list = [];
          let data = [];
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
                list = doc.data();
                data.push(doc.data());
                var dateKeys = Object.keys(data[0]).filter(function (el) {
                  return data[0][el].length > 0;
                });
                // console.log(dateKeys);
                const filtered = Object.fromEntries(
                  Object.entries(list).filter(
                    ([key, value]) => value.length > 0
                  )
                );

                // console.log(filtered);
                playDates = dateKeys;
                // const markedObject = Object.fromEntries(
                //   Object.entries(playMarks).map(([key, value]) => [
                //     key,
                //     { ...value, marked: playDates.includes(key) },
                //   ])
                // );

                // console.log(markedObject);

                Object.keys(playMarks)
                  .filter((date) => !dateKeys.includes(date))
                  .map((date) => (playMarks[date].marked = false));
                console.log("play objects", playMarks);

                setActualMarks(playMarks);
                setReserves(filtered);
                // setReserves(doc.data());
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
      console.log(marks);
      // console.log("playmarks", playMarks);
      // console.log(dateKeys);

      fetchMarkedDates();
      fetchSlots();
      fetchMembers();
    }, [])
  );

  // useEffect(() => {

  // }, []);

  const refreshSlots = async () => {
    try {
      let list = [];
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
            list = doc.data();
            const filtered = Object.fromEntries(
              Object.entries(list).filter(([key, value]) => value.length > 0)
            );
            setReserves(filtered);
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

  const refreshHandler = async () => {
    await fetchMarkedDates();
    await refreshSlots();
    await fetchMembers();
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
        flex: 1,
        padding: 5,
        paddingTop: 8,
      }}
    >
      <ActionSheet
        onBeforeShow={(data) => {
          setData(data);
        }}
        id="actionSheetRef"
        bounceOnOpen={true}
        elevation={15}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.panelTitle}>Opciones</Text>
          {/* <Text style={styles.panelSubtitle}>Eligir Foto de Perfil</Text> */}
        </View>

        <TouchableOpacity
          style={styles.panelButton}
          // onPress={takePhotoFromCamera}
        >
          <Text style={styles.panelButtonTitle}>Ver Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => {
            deletePrompt(data.value);
          }}
        >
          <Text style={styles.panelButtonTitle}>Borrar Evento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => {
            SheetManager.hide("actionSheetRef");
          }}
        >
          <Text style={styles.panelButtonTitle}>Cancelar</Text>
        </TouchableOpacity>
      </ActionSheet>
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
        items={reserves}
        style={styles.calendar}
        // hideExtraDays
        // markedDates={{ [selected]: { selected: true } }}

        markedDates={
          actualMarks
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
                  onPress={() => {
                    SheetManager.show("actionSheetRef", { value: item });
                  }}
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
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 7,
    width: 200,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});

export default CalenderHome;
