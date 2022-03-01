import React, { useState, useContext, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { TextInput, HelperText, Headline } from "react-native-paper";
import { AuthContext } from "../navigation/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";

const InfoComponent = (props) => {
  const { updateNote } = useContext(AuthContext);
  const [noteModal, setNoteModal] = useState(false);
  const [text, setText] = useState("");
  const [header, setHeader] = useState();
  const [data, setData] = useState();
  const [key, setKey] = useState();
  const [facts, setFacts] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      const list = [];
      const fetchFacts = async () => {
        try {
          await firebase
            .firestore()
            .collection("Members")
            .doc(props.id)
            .collection(props.section)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, data, timeStamp } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  data: data,
                  timeStamp: timeStamp,
                });
              });
            });
          setFacts(list);
        } catch (e) {
          console.log(e);
        }
      };
      fetchFacts();
      setIsLoading(false);
    }, [])
  );
  const fetchFacts = async () => {
    const list = [];

    try {
      await firebase
        .firestore()
        .collection("Members")
        .doc(props.id)
        .collection(props.section)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { title, data, timeStamp } = doc.data();
            list.push({
              key: doc.id,
              title: title,
              data: data,
              timeStamp: timeStamp,
            });
          });
        });
      setFacts(list);
    } catch (e) {
      console.log(e);
    }
  };
  const saveDataHandler = () => {
    setIsLoading(true);
    updateNote(header, text, key, props.section, props.id);

    // if (!editMode) {
    //   addNote(title, text, id);
    // } else {
    //   editNote(title, text, id, noteDetailId);
    // }
    fetchFacts();
    setIsLoading(false);
    setNoteModal(false);

    // setText("");
    // setTitle("");
    // setEditMode(false);
    // setTimeout(() => {
    //   fetchMemberNotes();
    // }, 1000);
  };
  return (
    <SafeAreaView style={styles.container}>
      <OrientationLoadingOverlay
        visible={isLoading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Cargando..."
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModal}
        onRequestClose={() => {
          setText("");
          setTitle("");
          setNoteModal(false);
          setTitleIsValid(true);
          setTextIsValid(true);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ height: 100, width: "100%" }}>
              <Headline>{header}</Headline>

              <TextInput
                underlineColor={Colors.primary}
                activeUnderlineColor={Colors.primary}
                // label="Data"
                placeholder={data}
                value={text}
                maxLength={20}
                onChangeText={(text) => setText(text)}
                right={<TextInput.Affix text={`${text.length}/20`} />}
                // error={!titleIsValid}
              />
              {/* <HelperText type="error" visible={!titleIsValid}>
                El titulo es muy corto!
              </HelperText> */}
            </View>

            <View style={{ marginTop: 50 }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setText("");
                  setData("");
                  setNoteModal(false);
                  // setTitleIsValid(true);
                  // setTextIsValid(true);
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={text.length < 1}
                style={[
                  styles.button,
                  text.length >= 1 ? styles.buttonOpen : styles.buttonDisabled,
                ]}
                onPress={() => {
                  saveDataHandler();
                }}
              >
                <Text style={styles.textStyle}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={facts}
          horizontal={false}
          keyExtractor={(item, index) => index}
          numColumns={2}
          renderItem={(itemData) => (
            <TouchableOpacity
              style={styles.details}
              onPress={() => {
                setHeader(itemData.item.title);
                setData(itemData.item.data);
                setKey(itemData.item.key);
                setNoteModal(true);
              }}
            >
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    height: "50%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    marginTop: 10,
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    marginTop: 10,
    backgroundColor: "grey",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
