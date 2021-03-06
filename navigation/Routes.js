import React, { useContext, useState, useEffect } from "react";
import { Text, View } from "react-native";

import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import firebase from "../components/firebase";

import { AuthContext } from "./AuthProvider";
import AwesomeIcon from "react-native-vector-icons/FontAwesome";

// import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
AwesomeIcon.loadFont();

const Routes = () => {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {/* {user ? <AppStack /> : <AuthStack />} */}
      {/* <AuthStack /> */}
      <AppStack />
    </NavigationContainer>
  );
};

export default Routes;
