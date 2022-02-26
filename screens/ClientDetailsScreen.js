import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
  Alert,
  SafeAreaView,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { ListItem, Avatar } from "react-native-elements";
import { Input } from "react-native-elements";
import { AuthContext } from "../navigation/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";
import InfoText from "../components/InfoText";
import styled, { useTheme } from "styled-components";
import NoteBlock from "../components/NoteBlock";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, HelperText, Headline, Paragraph } from "react-native-paper";

const ClientDetailsScreen = ({ route, navigation }) => {
  const { userNotificationReceipt, addNote, deleteNote, editNote } =
    useContext(AuthContext);

  const { id, data } = route.params;
  const [userNotes, setUserNotes] = useState([]);

  const [notify, setNotify] = useState(false);
  const [selectedClient, setSelectedClient] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [noteDetailModal, setNoteDetailModal] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifySubtitle, setNotifySubtitle] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [noteDetailTitle, setNoteDetailTitle] = useState("");
  const [noteDetailNote, setNoteDetailNote] = useState("");
  const [noteDetailId, setNoteDetailId] = useState("");
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [textIsValid, setTextIsValid] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const testList = [
    { title: "Informacion de Cliente", screen: "Info", key: 1 },
    { title: "Evaluacion Muscular", screen: "Muscular", key: 2 },
    ,
    { title: "Fecha Nacimiento", data: "21 de feb 1991", key: 3 },
    ,
    { title: "Lesion", data: "Rodilla derecha", key: 4 },
    { title: "Telefono", data: "+5911234567", key: 5 },
    { title: "Peso", data: "78 kilos", key: 6 },
    ,
  ];

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
                // console.log("Document data:", doc.data());
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
      const fetchMemberNotes = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(id)
            .collection("Member Notes")
            .orderBy("timestamp", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, ownerId, note, timeStamp } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  note: note,
                  ownerId: ownerId,
                  timeStamp: timeStamp,
                });
              });
            });
          setUserNotes(list);
        } catch (e) {
          console.log(e);
        }
      };
      fetchMemberNotes();
      fetchClientDetails();
    }, [])
  );

  const saveNoteHandler = () => {
    if (!editMode) {
      addNote(title, text, id);
    } else {
      editNote(title, text, id, noteDetailId);
    }
    setNoteModal(false);
    setText("");
    setTitle("");
    setEditMode(false);
    setTimeout(() => {
      fetchMemberNotes();
    }, 1000);
  };

  const fetchMemberNotes = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(id)
        .collection("Member Notes")
        .orderBy("timestamp", "asc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { title, ownerId, note, timeStamp } = doc.data();
            list.push({
              key: doc.id,
              title: title,
              note: note,
              ownerId: ownerId,
              timeStamp: timeStamp,
            });
          });
        });
      setUserNotes(list);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteHandler = async (docId) => {
    Alert.alert("Borrar Nota?", "Quiere borrar esta nota?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          await deleteNote(docId, id);
          fetchMemberNotes();
        },
      },
    ]);
  };

  // const hasErrors = () => {
  //   return title.length < 2;
  // };
  const hasErrors = (val) => {
    if (val.length < 2) {
      setTitle(val);
      setTitleIsValid(false);
    } else {
      setTitle(val);
      setTitleIsValid(true);
    }
  };
  const hasErrorsNote = (val) => {
    if (val.length < 10) {
      setText(val);
      setTextIsValid(false);
    } else {
      setText(val);
      setTextIsValid(true);
    }
  };

  const NoteMap = () => {
    userNotes.map((note) => {
      return (
        <NoteBlock
          title={note.title}
          onSelect={() => {
            setNoteDetailModal(true);
            setNoteDetailTitle(note.title);
            setNoteDetailNote(note.note);
            setNoteDetailId(note.key);
            //   itemData.item.key,
            //   itemData.item.title,
            //   itemData.item.timeStamp
            // );
          }}
          longPress={() => {
            deleteHandler(itemData.item.key);
          }}
        />
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <TextInput
                underlineColor={Colors.primary}
                activeUnderlineColor={Colors.primary}
                label="Titulo"
                value={title}
                maxLength={20}
                onChangeText={(text) => hasErrors(text)}
                right={<TextInput.Affix text={`${title.length}/20`} />}
                error={!titleIsValid}
              />
              <HelperText type="error" visible={!titleIsValid}>
                El titulo es muy corto!
              </HelperText>
            </View>
            <View style={{ height: 100, width: "100%" }}>
              <TextInput
                multiline
                underlineColor={Colors.primary}
                activeUnderlineColor={Colors.primary}
                label="Nota"
                value={text}
                onChangeText={(text) => hasErrorsNote(text)}
                error={!textIsValid}
              />
              <HelperText type="error" visible={!textIsValid}>
                Las notas deben ser minimo 10 caracteres!
              </HelperText>
            </View>
            <View style={{ marginTop: 50 }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setText("");
                  setTitle("");
                  setNoteModal(false);
                  setTitleIsValid(true);
                  setTextIsValid(true);
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
              <Pressable
                disabled={!titleIsValid || text.length < 10}
                style={[
                  styles.button,
                  title.length >= 2 && text.length >= 10
                    ? styles.buttonOpen
                    : styles.buttonDisabled,
                ]}
                onPress={() => {
                  saveNoteHandler();
                }}
              >
                <Text style={styles.textStyle}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteDetailModal}
        onRequestClose={() => {
          setNoteDetailModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Headline>{noteDetailTitle}</Headline>
            <Paragraph>{noteDetailNote}</Paragraph>
            <View style={{ marginTop: 100 }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setNoteDetailModal(false);
                }}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
              <Pressable
                //   disabled={!titleIsValid || text.length < 10}
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setNoteDetailModal(false);
                  setEditMode(true);
                  setTitle(noteDetailTitle);
                  setText(noteDetailNote);
                  setTimeout(() => {
                    setNoteModal(true);
                  }, 1000);
                }}
              >
                <Text style={styles.textStyle}>Editar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Edit");
          }}
        >
          <Avatar
            rounded
            // avatarStyle={styles.userImg}
            size={150}
            icon={{ name: "user", type: "font-awesome" }}
            source={{ uri: selectedClient.userImg }}
            onPress={() => {
              navigation.navigate("EditClient", {
                clientData: selectedClient,
              });
            }}
          >
            <Avatar.Accessory
              name="pencil-outline"
              type="material-community"
              size={40}
              onPress={() => {
                navigation.navigate("EditClient", {
                  clientData: selectedClient,
                });
              }}
              // color="black"
            />
          </Avatar>
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>
        {selectedClient.FirstName} {selectedClient.LastName}
      </Text>
      <Text style={styles.userInfoTitle}>{selectedClient.Cell}</Text>
      <Text style={styles.userInfoTitle}>{selectedClient.email}</Text>
      <ScrollView>
        <View style={styles.userBtnWrapper}>
          <Button
            color={Colors.primary}
            title={"Enviar notificacion"}
            onPress={() => {
              setNotify(true);
            }}
          />
        </View>
        {notify && (
          <View>
            <View style={styles.action}>
              <Input
                label="Titulo"
                leftIcon={{ type: "font-awesome", name: "edit" }}
                placeholder="Titulo"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={notifyTitle}
                onChangeText={(text) => setNotifyTitle(text)}
                autoCorrect={false}
              />
            </View>
            <View style={styles.action}>
              <Input
                label="Subtitulo"
                leftIcon={{ type: "font-awesome", name: "edit" }}
                placeholder="Subtitulo"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={notifySubtitle}
                onChangeText={(text) => setNotifySubtitle(text)}
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={
                notifyTitle === "" || notifySubtitle === ""
                  ? styles.commandButtonDsiabled
                  : styles.commandButton
              }
              onPress={() => {
                triggerNotificationHandler();
              }}
              disabled={
                notifyTitle === "" || notifySubtitle === "" ? true : false
              }
            >
              <Text style={styles.panelButtonTitle}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => {
                setNotify(false);
                setNotifyTitle("");
                setNotifySubtitle("");
              }}
            >
              <Text style={styles.panelButtonTitle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        <Subtitle>{"Notas de Sesiones".toUpperCase()}</Subtitle>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Nueva Nota", "Quisieras agregar una nueva nota?", [
              {
                text: "Si",
                onPress: () => setNoteModal(true),
              },
              {
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]);
          }}
          style={{ marginRight: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontSize: 18, color: "silver" }}>
                Agregar Nota{" "}
              </Text>
            </View>
            <View
              style={{
                width: 35,
                height: 30,
                borderColor: Colors.primary,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                shadowColor: "black",
                shadowOpacity: 0.26,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Ionicons
                name={Platform.OS === "android" ? "md-add" : "ios-add"}
                size={20}
                color="grey"
              />
            </View>
          </View>
        </TouchableOpacity>
        {userNotes.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                padding: 10,
                fontSize: 15,
                textAlign: "center",
                color: "#b8bece",
              }}
            >
              Oprime el {<Text style={{ fontSize: 25 }}>'+'</Text>} para crear
              tu primera Nota.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal style={{ height: 100 }}>
            {userNotes.map((note) => {
              return (
                <NoteBlock
                  key={note.key}
                  title={note.title}
                  onSelect={() => {
                    setNoteDetailModal(true);
                    setNoteDetailTitle(note.title);
                    setNoteDetailNote(note.note);
                    setNoteDetailId(note.key);
                    //   itemData.item.key,
                    //   itemData.item.title,
                    //   itemData.item.timeStamp
                    // );
                  }}
                  longPress={() => {
                    deleteHandler(itemData.item.key);
                  }}
                />
              );
            })}
            {/* <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={userNotes}
              keyExtractor={(item) => item.key}
              renderItem={(itemData) => (
                <NoteBlock
                  title={itemData.item.title}
                  onSelect={() => {
                    setNoteDetailModal(true);
                    setNoteDetailTitle(itemData.item.title);
                    setNoteDetailNote(itemData.item.note);
                    setNoteDetailId(itemData.item.key);
                    //   itemData.item.key,
                    //   itemData.item.title,
                    //   itemData.item.timeStamp
                    // );
                  }}
                  longPress={() => {
                    deleteHandler(itemData.item.key);
                  }}
                />
              )}
            /> */}
          </ScrollView>
        )}
        <Subtitle>{"Historia Clínica Fisioterapia".toUpperCase()}</Subtitle>

        <ScrollView>
          {testList.map((item) => {
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  navigation.navigate("Section", {
                    section: item.screen,
                    id: id,
                  });
                }}
                style={{
                  backgroundColor: Colors.primary,
                  flex: 1,

                  shadowColor: "black",
                  shadowOpacity: 0.56,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 5,
                  elevation: 5,
                  alignSelf: "center",
                  margin: 10,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  padding: 10,
                  width: "85%",
                  height: 70,
                  // alignItems: "center",
                  justifyContent: "center",
                  // flexWrap: "wrap",
                }}
              >
                <Text style={styles.dataButtonTitle}>{item.title}</Text>
                {/* <Text
                  style={{ textAlign: "center", marginTop: 5, fontSize: 18 }}
                >
                  {item.data}
                </Text> */}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImg: {
    marginTop: 20,
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  border: {
    flexDirection: "row",
    width: Dimensions.get("window").width / 1.2,
    borderWidth: 0.7,
    borderColor: "black",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  userBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#2e64e5",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: "center",
    padding: 10,
  },
  userInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoPoints: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: Colors.primary,
  },
  userInfoTitleId: {
    color: "silver",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  item: {
    width: "50%", // is 50% of container width
  },
  action: {
    flexDirection: "row",
    // marginTop: 5,
    // marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  dataButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
  },
  commandButtonDsiabled: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "silver",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  shadow: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
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

const Subtitle = styled.Text`
  color: #5b91a6;
  font-weight: 600;
  font-size: 20px;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;
