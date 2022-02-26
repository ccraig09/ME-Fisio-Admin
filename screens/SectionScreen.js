import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import InfoComponent from "../components/InfoComponent";
import MuscularComponent from "../components/MuscularComponent";
import { AuthContext } from "../navigation/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";

const SectionScreen = ({ route, navigation }) => {
  const { section, id } = route.params;
  const [selectedClient, setSelectedClient] = useState();

  useFocusEffect(
    React.useCallback(() => {
      // console.log("loading home and user", user);
      const fetchClientDetails = async () => {
        try {
          await firebase
            .firestore()
            .collection("Members")
            .doc(id)
            .get()
            .then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data().Info.Nombre);
                setSelectedClient(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };

      fetchClientDetails();
    }, [])
  );

  const selectedComponent = () => {
    if (section === "Info") {
      // console.log("looking for info", selectedClient[Cell]);
      console.log("info");
      return <InfoComponent data={selectedClient} />;
    }
    if (section === "Muscular") {
      console.log("muscle");
      return <MuscularComponent />;
    }
  };
  return selectedComponent();
};

export default SectionScreen;

const styles = StyleSheet.create({});
