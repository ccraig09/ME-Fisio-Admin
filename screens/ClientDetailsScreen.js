import React, { useState, useContext, useEffect, createRef } from "react";
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
  Dimensions,
  TouchableOpacity,
  Button,
  ActivityIndicator,
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
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import * as ImagePicker from "expo-image-picker";
// import ImageView from "react-native-image-viewing";
import ImageViewer from "react-native-image-zoom-viewer";
import Toast from "react-native-tiny-toast";

const actionSheetRef = createRef();

const ClientDetailsScreen = ({ route, navigation }) => {
  const {
    userNotificationReceipt,
    addNote,
    deleteNote,
    editNote,
    userProfilePic,
  } = useContext(AuthContext);

  const { id, data } = route.params;
  const [userNotes, setUserNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [transferred, setTransferred] = useState();
  const [URLs, setURLs] = useState([]);
  const [progress, setProgress] = useState([]);
  const [imgView, setImgView] = useState();

  const [updatingImg, setUpdatingImg] = useState(false);
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
  const [selectedLoader, setSelectedLoader] = useState();
  const [noteDetailId, setNoteDetailId] = useState("");
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [textIsValid, setTextIsValid] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [profileImg, setProfileImg] = useState("");

  const testList = [
    { title: "Informacion de Cliente", screen: "Info", key: 1 },
    { title: "Evaluacion Muscular", screen: "Muscular", key: 2 },
    ,
    { title: "Prueba de Arcos Superiores", screen: "Superiores", key: 3 },
    ,
    { title: "Prueba de Arcos Inferiores", screen: "Inferiores", key: 4 },
    { title: "An??lisis de la Marcha", screen: "Marcha", key: 5 },
    { title: "Evaluaci??n en la Postura", screen: "Postura", key: 6 },
    ,
  ];

  useEffect(() => {
    (async () => {
      // if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "??Permisos insuficientes!",
          "Lo siento, necesitamos permiso para acceder a la c??mara.",
          [{ text: "Listo" }]
        );
      }
      // }
    })();
    // console.log("this the selected", selectedClient.clientData);
  }, []);
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
                const { title, ownerId, note, timeStamp, url } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  note: note,
                  ownerId: ownerId,
                  url: url,
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
  const onFinish = () => {
    // console.log("this e", e);
    setImageLoading(false);
  };
  const onStart = () => {
    setImageLoading(true);
    console.log("started?", imageLoading);
  };

  const ImageRow = () => {
    if (images.length > 0) {
      return images.map((image, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              setImgView(Object.assign([{ url: image }]));
              setNoteModal(false);
              setNoteDetailModal(false);
              setIsVisible(true);
            }}
          >
            <Image
              style={{
                height: 200,
                width: 200,
                marginHorizontal: 5,
                borderRadius: 2,
              }}
              source={{
                uri: image,
              }}
              // onLoadStart={() => {
              //   onStart();
              // }}
              onLoadEnd={() => {
                onFinish();
              }}
              // onProgress={(loaded) => {
              //   console.log(
              //     "this is tot",
              //     Math.round(
              //       loaded.nativeEvent.loaded / loaded.nativeEvent.total
              //     ) * 100
              //   );
              //   // console.log("this is this is total", total);
              // }}
            />
            {editMode || addMode ? (
              <CloseView
                onPress={() => {
                  Alert.alert("Borrar imagen?", "Quiere borrar esta imagen?", [
                    { text: "No", style: "default" },
                    {
                      text: "Si",
                      style: "destructive",
                      onPress: () => {
                        setImages([
                          ...images.slice(0, index),
                          ...images.slice(index + 1, images.length),
                        ]);
                      },
                    },
                  ]);
                }}
              >
                <Ionicons name="ios-close" size={25} color="black" />
              </CloseView>
            ) : null}
            {/* {imageLoading && <ActivityIndicator color="black" size="large" />} */}
          </TouchableOpacity>
        );
      });
    } else {
      return <View></View>;
    }
  };
  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      if (noteModal) {
        setImages([...images, result.uri]);
      } else {
        const toast = Toast.showLoading("Subieno Foto");
        setProfileImg(result.uri);
        await userProfilePic(id, result.uri);
        SheetManager.hide("actionSheetRefImg");
        Toast.hide(toast);
      }
    }
  };

  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: false,
      // aspect: [4, 3],
      quality: 0.3,
    });
    console.log(result);

    if (!result.cancelled) {
      if (noteModal) {
        setImages([...images, result.uri]);
      } else {
        const toast = Toast.showLoading("Subiendo foto");
        setProfileImg(result.uri);
        await userProfilePic(id, result.uri);
        SheetManager.hide("actionSheetRefImg");
        Toast.hide(toast);
      }
    }
  };
  const finishHandler = async (urls) => {
    // const toast = Toast.showLoading("Subieno");
    console.log("finishing");
    addNote(title, text, id, urls);
    setText("");
    setTitle("");
    setImages([]);

    Alert.alert("Nota Guardado!", "La nota se ha guardado exitosamente!");
    setTimeout(() => {
      setEditMode(false);
      setAddMode(false);
      setURLs([]);
      fetchMemberNotes();
    }, 1000);
    // Toast.hide(toast);
  };
  const submitChanges = async () => {
    setNoteModal(false);

    const toast = Toast.showLoading("Subiendo");
    if (images.length > 0) {
      let res = await uploadImage();
      console.log("this is res", res);
      finishHandler(res);
    }
    if (images.length === 0) {
      let url = null;
      console.log("more this is 0");
      finishHandler(url);
    }
    Toast.hide(toast);
  };

  const uploadImage = async () => {
    const promises = images.map(async (file, index) => {
      const response = await fetch(file);
      const blob = await response.blob();

      // setUploading(true);

      setTransferred(0);

      const storageRef = firebase
        .storage()
        .ref()
        .child("sessionNotesImgs/" + `${id}/` + `${title}/` + `${index}`);

      // const uploadUri = image;
      // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

      const task = storageRef.put(blob);

      // Set transferred state
      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );
        setTransferred(
          Math.round(
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
          )
        );
      });

      try {
        await task;

        const url = await storageRef.getDownloadURL();
        setURLs((prevState) => [...prevState, url]);
        // console.log("url downloaded", url);
        // navigation.goBack();
        setUploading(false);
        return url;
      } catch (e) {
        console.log(e);
        return null;
      }

      // alert("done");
    });
    const results = await Promise.all(promises);
    return results;
    // console.log("this is results", results);
    // alert("done");
  };

  const saveNoteHandler = async () => {
    if (!editMode || addMode) {
      submitChanges();
    } else {
      if (images.length === 0) {
        editNote(title, text, id, noteDetailId, null);
      }
      setNoteModal(false);
      const toast = Toast.showLoading("Subiendo");
      await editNote(title, text, id, noteDetailId, images);
      setText("");
      setTitle("");
      setImages([]);
      setEditMode(false);

      Toast.hide(toast);
      Alert.alert("Nota Guardado!", "La nota se ha guardado exitosamente!");

      setTimeout(() => {
        fetchMemberNotes();
      }, 1000);
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
            const { title, ownerId, note, url, timeStamp } = doc.data();
            list.push({
              key: doc.id,
              title: title,
              note: note,
              ownerId: ownerId,
              url: url,
              timeStamp: timeStamp,
            });
          });
        });
      setUserNotes(list);
    } catch (e) {
      console.log(e);
    }
  };

  const selectedHandler = async (screen) => {
    navigation.navigate("Section", {
      section: screen,
      // data: list,
      id: id,
    });
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
    if (val.length < 5) {
      setText(val);
      setTextIsValid(false);
    } else {
      setText(val);
      setTextIsValid(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={visible} transparent={true}>
        <ImageViewer
          imageUrls={imgView}
          enableSwipeDown
          onCancel={() => {
            setImgView([]);
            setIsVisible(false);
            if (editMode || addMode) {
              setNoteModal(true);
            } else {
              setNoteDetailModal(true);
            }
          }}
        />
      </Modal>
      <ActionSheet id="actionSheetRefImg" bounceOnOpen={true}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.panelTitle}>Subir Foto</Text>
          <Text style={styles.panelSubtitle}>Eligir Foto de Perfil</Text>
        </View>

        <TouchableOpacity
          style={styles.panelButton}
          onPress={takePhotoFromCamera}
        >
          <Text style={styles.panelButtonTitle}>Abrir Camara</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={choosePhotoFromLibrary}
        >
          <Text style={styles.panelButtonTitle}>Abrir Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => {
            SheetManager.hide("actionSheetRefImg");
          }}
        >
          <Text style={styles.panelButtonTitle}>Cancelar</Text>
        </TouchableOpacity>
      </ActionSheet>
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
        <ScrollView>
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
                  // multiline
                  underlineColor={Colors.primary}
                  activeUnderlineColor={Colors.primary}
                  label="Nota"
                  value={text}
                  onChangeText={(text) => hasErrorsNote(text)}
                  error={!textIsValid}
                />
                <HelperText type="error" visible={!textIsValid}>
                  Las notas deben ser minimo 5 caracteres!
                </HelperText>
              </View>
              <ScrollView horizontal style={{ height: 220, width: "100%" }}>
                <ImageRow />
              </ScrollView>
              {/* <Image
                source={{ uri: `${image}` }}
                style={{ height: 200, width: 200 }}
              /> */}
              {uploading && (
                <View>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text>Subiendo</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.panelButtonModal}
                onPress={takePhotoFromCamera}
              >
                <Text style={styles.panelButtonTitleModal}>Abrir Camara</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.panelButtonModal}
                onPress={choosePhotoFromLibrary}
              >
                <Text style={styles.panelButtonTitleModal}>Abrir Galeria</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setText("");
                    setTitle("");
                    setEditMode(false);
                    setAddMode(false);
                    setNoteModal(false);
                    setUploading(false);
                    setTitleIsValid(true);
                    setTextIsValid(true);
                    setImages([]);
                  }}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!titleIsValid || text.length < 5}
                  style={[
                    styles.button,
                    title.length >= 2 && text.length >= 5
                      ? styles.buttonOpen
                      : styles.buttonDisabled,
                  ]}
                  onPress={() => {
                    saveNoteHandler();
                  }}
                >
                  <Text style={styles.textStyle}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
            {imageLoading && (
              <View>
                <ActivityIndicator size={"small"} color={Colors.primary} />
                <Text>
                  Cargando
                  {images.length > 1 ? (
                    <Text> {images.length} imagenes</Text>
                  ) : (
                    <Text> {images.length} imagen</Text>
                  )}
                </Text>
              </View>
            )}
            {images != null && (
              // {images.length > 0 && (
              <ScrollView horizontal style={{ height: 220, width: "100%" }}>
                <ImageRow />
              </ScrollView>
            )}
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setImages([]);
                  setNoteDetailModal(false);
                }}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                //   disabled={!titleIsValid || text.length < 10}
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  console.log(images);
                  setEditMode(true);
                  setNoteDetailModal(false);
                  setTitle(noteDetailTitle);
                  setText(noteDetailNote);
                  setTimeout(() => {
                    setNoteModal(true);
                  }, 1000);
                }}
              >
                <Text style={styles.textStyle}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ marginTop: 20 }}>
        <View>
          <Avatar
            rounded
            // avatarStyle={styles.userImg}
            size={150}
            icon={{ name: "user", type: "font-awesome" }}
            source={{
              uri: !profileImg ? selectedClient.userImg : profileImg,
            }}
          >
            <Avatar.Accessory
              name="pencil-outline"
              type="material-community"
              size={40}
              onPress={() => {
                SheetManager.show("actionSheetRefImg");
              }}
              // color="black"
            />
          </Avatar>
        </View>
      </View>
      <Text style={styles.userName}>
        {selectedClient.FirstName} {selectedClient.LastName}
      </Text>
      <Text style={styles.userInfoTitle}>{selectedClient.Cell}</Text>
      <Text style={styles.userInfoTitle}>{selectedClient.email}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userBtnWrapper}>
          <Text
            style={styles.btnWrapperText}
            onPress={() => {
              setNotify(true);
            }}
          >
            Enviar notificacion
          </Text>
          <Text
            style={styles.btnWrapperText}
            onPress={() => {
              navigation.navigate("Booking", {
                userInfo: selectedClient,
              });
            }}
          >
            Cita
          </Text>
          <Text
            style={styles.btnWrapperText}
            onPress={() => {
              navigation.navigate("PDF", {
                id: id,
              });
            }}
          >
            Exportar PDF
          </Text>
          {/* <Button
            color={Colors.primary}
            title={"Cita"}
            onPress={() => {
              navigation.navigate("Booking", {
                userInfo: selectedClient,
              });
            }}
          />
          <Button
            color={Colors.primary}
            title={"Exportar PDF"}
            onPress={() => {
              navigation.navigate("PDF", {
                id: id,
              });
            }}
          /> */}
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
                onPress: () => {
                  setAddMode(true);
                  setNoteModal(true);
                },
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
                // elevation: 1,
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
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ height: 100 }}
          >
            {userNotes.map((note) => {
              return (
                <NoteBlock
                  key={note.key}
                  title={note.title}
                  onSelect={() => {
                    setEditMode(false);
                    setAddMode(false);
                    if (note.url != null) {
                      setImageLoading(true);
                    }
                    setImages(note.url);
                    setNoteDetailTitle(note.title);
                    setNoteDetailNote(note.note);
                    setNoteDetailId(note.key);
                    setNoteDetailModal(true);
                  }}
                  longPress={() => {
                    deleteHandler(note.key);
                  }}
                />
              );
            })}
          </ScrollView>
        )}
        <Subtitle>{"Historia Cl??nica Fisioterapia".toUpperCase()}</Subtitle>

        <ScrollView showsVerticalScrollIndicator={false}>
          {testList.map((item) => {
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  selectedHandler(item.screen);
                  // navigation.navigate("Section", {
                  //   section: item.screen,
                  //   id: id,
                  //   data: selectedClient,
                  // });
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
  btnWrapperText: {
    margin: 5,
    color: Colors.primary,
    fontSize: 18,
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
  imgButton: {
    color: Colors.primary,
    fontSize: 18,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    // height: "80%",
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
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
    borderRadius: 10,
    width: 150,
  },
  buttonDisabled: {
    marginTop: 10,
    backgroundColor: "grey",
    borderRadius: 10,
    width: 150,
  },
  buttonClose: {
    backgroundColor: "red",
    width: 150,
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
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
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  panelButtonModal: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 7,
    width: 150,
  },
  panelButtonTitleModal: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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

const CloseView = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 12px;
  background-color: white;
  border-radius: 25px;
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 5px #888888;
`;
