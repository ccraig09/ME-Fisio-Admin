import React, { Component, useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
// import styles from '../../components/commonstyle'
// import { CalendarList } from "react-native-calendars";
import CalenderHome from "../components/CalenderHome";
import Colors from "../constants/Colors";
import { useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import firebase from "../components/firebase";
import { AuthContext } from "../navigation/AuthProvider";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";
import * as Device from "expo-device";

// import { DrawerContent } from "../components/DrawerContent";

let screenHeight = Dimensions.get("window").height;

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const HomeScreen = ({ navigation }) => {
  const { user, addToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);

  const route = useRoute();
  console.log(route.name);
  // <DrawerContent screenName={route.name} />;

  const [selected, setSelected] = useState();

  // const onDayPress = (day) => {
  //   alert(day);
  //   setSelected(day.dateString);
  //   navigation.navigate("Slot", { bookingDate: day });
  // };
  useFocusEffect(
    React.useCallback(() => {
      // const fetchCoaches = async () => {
      //   try {
      //     const list = [];
      //     await firebase
      //       .firestore()
      //       .collection("Coaches")
      //       .get()
      //       .then((querySnapshot) => {
      //         querySnapshot.forEach((doc) => {
      //           const {
      //             FirstName,
      //             LastName,
      //             userImg,
      //             email,
      //             Phone,
      //             createdAt,
      //             expoPushToken,
      //             country,
      //             userId,
      //           } = doc.data();
      //           list.push({
      //             key: doc.id,
      //             FirstName: FirstName,
      //             LastName: LastName,
      //             userImg: userImg,
      //             email: email,
      //             Phone: Phone,
      //             country: country,
      //             createdAt: createdAt,
      //             expoPushToken,
      //             userId: userId,
      //           });
      //         });
      //       });
      //     setCoachList(list);
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };
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
      const fetchNotifications = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Notifications")
            .where("isRead", "==", false)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Cell,
                  timestamp,
                  userId,
                  Goals,
                  Plan,
                  extraInfo,
                  Time,
                  Status,
                  startDate,
                  Suggestion,
                  isRead,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: Title,
                  Cell: Cell,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  Goals: Goals,
                  Plan: Plan,
                  extraInfo: extraInfo,
                  Time: Time,
                  Status: Status,
                  startDate: startDate,
                  Suggestion: Suggestion,
                  isRead: isRead,
                  sort: timestamp,
                });
              });
            });
          console.log(list);
          // setNotificationList(list.length);
        } catch (e) {
          console.log(e);
        }
      };
      // fetchMemberDetails();
      // fetchCoaches();
    }, [])
  );
  useEffect(() => {
    Notifications.cancelAllScheduledNotificationsAsync();
    // dailyNotification();
    registerForPushNotificationsAsync().then((token) => {
      // setExpoPushToken(token);
      console.log("tokens match check", token, userInfo.expoPushToken);
      if (token !== userInfo.expoPushToken) {
        addToken(token);
      }
      // console.log();
    });
  }, []);
  async function registerForPushNotificationsAsync() {
    ``;
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Alerta",
          "No recibirá noticias si no habilita las notificaciones. Si desea recibir notificaciones, habilitelas desde configuración.",
          [
            { text: "Cancel" },
            // If they said no initially and want to change their mind,
            // we can automatically open our app in their settings
            // so there's less friction in turning notifications on
            {
              text: "Activar Notificaciones",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ]
        );
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("background", response);
        // navigation.navigate("Edit");
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("foreground", notification);
      });
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  return (
    // <SafeAreaView style={styles.container}>
    <CalenderHome
      drawerAction={() => {
        navigation.openDrawer();
      }}
    />
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  // calendar: {
  //   borderTopWidth: 1,
  //   paddingTop: 5,
  //   borderBottomWidth: 1,
  //   borderColor: "#eee",
  //   height: screenHeight,
  // },
});
export default HomeScreen;
