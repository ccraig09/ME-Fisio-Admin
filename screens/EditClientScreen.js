import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  createRef,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Button,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Text,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import Colors from "../constants/Colors";

// import { Picker } from "@react-native-picker/picker";
// import Moment from "moment";
// import localization from "moment/locale/es-us";
// import "moment/locale/es";
// import { extendMoment } from "moment-range";
// import InfoText from "../components/InfoText";
// import { Input } from "react-native-elements";
// import InputSpinner from "react-native-input-spinner";

import { AuthContext } from "../navigation/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
// import DateTimePicker from "react-native-modal-datetime-picker";
import ActionSheet from "react-native-actions-sheet";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const actionSheetRef = createRef();

const EditClientScreen = ({ navigation, route }) => {
  const { user, editClient, logout } = useContext(AuthContext);
  const selectedClient = route.params;
  const [image, setImage] = useState(null);
  const [baseStartDate, setBaseStartDate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [picked, setPicked] = useState();
  const [notes, setNotes] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    (async () => {
      // if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "¡Permisos insuficientes!",
          "Lo siento, necesitamos permiso para acceder a la cámara.",
          [{ text: "Listo" }]
        );
      }
      // }
    })();
    console.log("this the selected", selectedClient.clientData);
    setUserInfo(selectedClient.clientData);
    setImage(selectedClient.clientData.userImg);
  }, []);

  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      actionSheetRef.current?.hide();
    }
  };

  const choosePhotoFromLibrary = async () => {
    console.log("opening gallery");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      actionSheetRef.current?.hide();
    }
  };
  const submitChanges = async () => {
    let imageUrl = await uploadImage();
    console.log(imageUrl);
    if (imageUrl == null && userInfo.userImg) {
      imageUrl = userInfo.userImg;
    }
    if (imageUrl == null && userInfo.userImg == null) {
      imageUrl = null;
    }

    await editClient(userInfo, imageUrl);

    if (image == null) {
      Alert.alert(
        "Cliente Actualizado!",
        "El Cliente se ha actualizado exitosamente!"
      );
    }

    navigation.goBack();
  };

  const uploadImage = async () => {
    if (image == null) {
      console.log("image is null");
      return null;
    }
    // const uploadUri = image;
    const response = await fetch(image);
    const blob = await response.blob();
    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    setUploading(true);
    setTransferred(0);
    const storageRef = firebase
      .storage()
      .ref()
      .child("UserProfileImages/" + `${user.uid}/` + "ProfileImage");

    const task = storageRef.put(blob);

    // Set transferred state
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
      setTransferred(
        (
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
        ).toFixed(0)
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      Alert.alert(
        "Cliente Actualizado!",
        "El Cliente se ha actualizado exitosamente!"
      );

      navigation.goBack();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActionSheet ref={actionSheetRef} bounceOnOpen={true}>
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
            actionSheetRef.current?.hide();
          }}
        >
          <Text style={styles.panelButtonTitle}>Cancelar</Text>
        </TouchableOpacity>
      </ActionSheet>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            actionSheetRef.current?.setModalVisible();
          }}
        >
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={{ uri: `${image}` }}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  size={35}
                  color="#fff"
                  style={{
                    opacity: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#fff",
                    borderRadius: 10,
                  }}
                />
                {image == null && <Text>Agregar Foto</Text>}
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
          {userInfo
            ? typeof userInfo.FirstName === "undefined"
              ? ""
              : userInfo.FirstName
            : ""}
          <Text> </Text>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {userInfo
              ? typeof userInfo.LastName === "undefined"
                ? ""
                : userInfo.LastName
              : ""}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EditClientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  modalTextTitle: {
    marginTop: 4,
    marginBottom: 4,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalItemBorderCategoria: {
    backgroundColor: "#F5F3F3",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#F5F3F3",
    alignItems: "center",
    margin: 5,
    padding: 5,
    shadowColor: "silver",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1.84,
    elevation: 1,
  },
});
