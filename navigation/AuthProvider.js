import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import firebase from "../components/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
  const [user, setUser] = useState(null);
  const db = firebase.firestore().collection("Members");
  const dbN = firebase.firestore().collection("Notifications");

  const firebaseErrors = {
    "auth/app-deleted": "No se encontró la base de datos",
    "auth/expired-action-code": "El código de acción o el enlace ha caducado",
    "auth/invalid-action-code":
      "El código de acción no es válido. Esto puede suceder si el código está mal formado o ya se ha utilizado",
    "auth/user-disabled":
      "El usuario correspondiente a la credencial proporcionada ha sido deshabilitado",
    "auth/user-not-found": "El usuario no coincide con ninguna credencial",
    "auth/weak-password": "La contraseña es demasiado débil",
    "auth/email-already-in-use":
      "Ya tenía una cuenta con la dirección de correo electrónico proporcionada",
    "auth/invalid-email": "La dirección de correo electrónico no es válida",
    "auth/operation-not-allowed":
      "El tipo de cuenta correspondiente a esta credencial aún no está activado",
    "auth/account-exists-with-different-credential":
      "Correo electrónico ya asociado con otra cuenta",
    "auth/auth-domain-config-required":
      "No se ha proporcionado la configuración para la autenticación",
    "auth/credential-already-in-use":
      "Ya existe una cuenta para esta credencial",
    "auth/operation-not-supported-in-this-environment":
      "Esta operación no se admite en el entorno que se realiza. Asegúrese de que debe ser http o https",
    "auth/timeout":
      "Tiempo de respuesta excedido. Es posible que el dominio no esté autorizado para realizar operaciones",
    "auth/missing-android-pkg-name":
      "Se debe proporcionar un nombre de paquete para instalar la aplicación de Android",
    "auth/missing-continue-uri":
      "La siguiente URL debe proporcionarse en la solicitud",
    "auth/missing-ios-bundle-id":
      "Se debe proporcionar un nombre de paquete para instalar la aplicación iOS",
    "auth/invalid-continue-uri":
      "La siguiente URL proporcionada en la solicitud no es válida",
    "auth/unauthorized-continue-uri":
      "El dominio de la siguiente URL no está en la lista blanca",
    "auth/invalid-dynamic-link-domain":
      "El dominio de enlace dinámico proporcionado, no está autorizado o configurado en el proyecto actual",
    "auth/argument-error":
      "Verifique la configuración del enlace para la aplicación",
    "auth/invalid-persistence-type":
      "El tipo especificado para la persistencia de datos no es válido",
    "auth/unsupported-persistence-type":
      "El entorno actual no admite el tipo especificado para la persistencia de datos",
    "auth/invalid-credential": "La credencial ha caducado o está mal formada",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/invalid-verification-code":
      "El código de verificación de credencial no es válido",
    "auth/invalid-verification-id":
      "El ID de verificación de credencial no es válido",
    "auth/custom-token-mismatch":
      "El token es diferente del estándar solicitado",
    "auth/invalid-custom-token": "El token proporcionado no es válido",
    "auth/captcha-check-failed":
      "El token de respuesta reCAPTCHA no es válido, ha caducado o el dominio no está permitido",
    "auth/invalid-phone-number":
      "El número de teléfono está en un formato no válido (estándar E.164)",
    "auth/missing-phone-number": "El número de teléfono es obligatorio",
    "auth/quota-exceeded": "Se ha excedido la cuota de SMS",
    "auth/cancelled-popup-request":
      "Solo se permite una solicitud de ventana emergente a la vez",
    "auth/popup-blocked": "El navegador ha bloqueado la ventana emergente",
    "auth/popup-closed-by-user":
      "El usuario cerró la ventana emergente sin completar el inicio de sesión en el proveedor",
    "auth/unauthorized-domain":
      "El dominio de la aplicación no está autorizado para realizar operaciones",
    "auth/invalid-user-token": "El usuario actual no fue identificado",
    "auth/user-token-expired": "El token del usuario actual ha caducado",
    "auth/null-user": "El usuario actual es nulo",
    "auth/app-not-authorized":
      "Aplicación no autorizada para autenticarse con la clave dada",
    "auth/invalid-api-key": "La clave API proporcionada no es válida",
    "auth/network-request-failed": "Error al conectarse a la red",
    "auth/requires-recent-login":
      "El último tiempo de acceso del usuario no cumple con el límite de seguridad",
    "auth/too-many-requests":
      "Las solicitudes se bloquearon debido a una actividad inusual. Vuelva a intentarlo después de un tiempo",
    "auth/web-storage-unsupported":
      "El navegador no es compatible con el almacenamiento o si el usuario ha deshabilitado esta función",
    "auth/invalid-claims":
      "Los atributos de registro personalizados no son válidos",
    "auth/claims-too-large":
      "El tamaño de la solicitud excede el tamaño máximo permitido de 1 Megabyte",
    "auth/id-token-expired": "El token informado ha caducado",
    "auth/id-token-revoked": "El token informado ha caducado",
    "auth/invalid-argument":
      "Se proporcionó un argumento no válido a un método",
    "auth/invalid-creation-time":
      "La hora de creación debe ser una fecha UTC válida",
    "auth/invalid-disabled-field":
      "La propiedad para el usuario deshabilitado no es válida",
    "auth/invalid-display-name": "El nombre de usuario no es válido",
    "auth/invalid-email-verified": "El correo electrónico no es válido",
    "auth/invalid-hash-algorithm":
      "El algoritmo HASH no es compatible con la criptografía",
    "auth/invalid-hash-block-size": " El tamaño del bloque HASH no es válido ",
    "auth/invalid-hash-derived-key-length":
      "El tamaño de la clave derivada de HASH no es válido",
    "auth/invalid-hash-key":
      "La clave HASH debe tener un búfer de bytes válido",
    "auth/invalid-hash-memory-cost": "El costo de la memoria HASH no es válido",
    "auth/invalid-hash-parallelization": "La carga paralela HASH no es válida",
    "auth/invalid-hash-rounds": "El redondeo HASH no es válido",
    "auth/invalid-hash-salt-separator":
      "El campo separador SALT del algoritmo de generación HASH debe ser un búfer de bytes válido",
    "auth/invalid-id-token": "El código de token ingresado no es válido",
    "auth/invalid-last-sign-in-time":
      "La última hora de inicio de sesión debe ser una fecha UTC válida",
    "auth/invalid-page-token":
      "La siguiente URL proporcionada en la solicitud no es válida",
    "auth/invalid-password":
      "La contraseña no es válida, debe tener al menos 6 caracteres de longitud",
    "auth/invalid-password-hash": "La contraseña HASH no es válida",
    "auth/invalid-password-salt": "La contraseña SALT no es válida",
    "auth/invalid-photo-url": "La URL de la foto del usuario no es válida",
    "auth/invalid-provider-id":
      "El identificador del proveedor no es compatible",
    "auth/invalid-session-cookie-duration":
      "La duración de la COOKIE de la sesión debe ser un número válido en milisegundos, entre 5 minutos y 2 semanas",
    "auth/invalid-uid":
      "El identificador proporcionado debe tener un máximo de 128 caracteres",
    "auth/invalid-user-import":
      "El registro de usuario a importar no es válido",
    "auth/invalid-provider-data": "El proveedor de datos no es válido",
    "auth/maximum-user-count-exceeded":
      "Se ha excedido el número máximo permitido de usuarios a importar",
    "auth/missing-hash-algorithm":
      "Es necesario proporcionar el algoritmo de generación HASH y sus parámetros para importar usuarios",
    "auth/missing-uid": "Se requiere un identificador para la operación actual",
    "auth/reserved-claims":
      "Una o más propiedades personalizadas proporcionaron palabras reservadas usadas",
    "auth/session-cookie-revoked": "La sesión COOKIE ha expirado",
    "auth/uid-alread-exists": "El identificador proporcionado ya está en uso",
    "auth/email-already-exists":
      "El correo electrónico proporcionado ya está en uso",
    "auth/phone-number-already-exists":
      "El teléfono proporcionado ya está en uso",
    "auth/project-not-found": "No se encontraron proyectos",
    "auth/insufficient-permission":
      "La credencial utilizada no tiene acceso al recurso solicitado",
    "auth/internal-error":
      "El servidor de autenticación encontró un error inesperado al intentar procesar la solicitud",
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(firebase.auth().currentUser.uid);
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(errorMes);
            console.log(errorMes);
            console.log(e.code);
          }
        },
        // register: async (fName, lName, email, password) => {
        //   try {
        //     await firebase
        //       .auth()
        //       .createUserWithEmailAndPassword(email, password)
        //       .then(() => {
        //         db.doc(firebase.auth().currentUser.uid).set({
        //           userId: firebase.auth().currentUser.uid,
        //           FirstName: fName,
        //           LastName: lName,
        //           Phone: '',
        //           password,
        //           email: email,
        //           plan: '',
        //           startDate: '',
        //           endDate: '',
        //           goal: '',
        //           points: '',
        //           history: '',
        //           sport: '',
        //           Age: '',
        //           Height: '',
        //           Weight: '',
        //           Gender: '',
        //           BaseStartDate: '',
        //           Imc: '',
        //           Grasa: '',
        //           Musculo: '',
        //           Basal: '',
        //           GoalBasal: '',
        //           Agua: '',
        //           Proteina: '',
        //           Osea: '',
        //           Metabolica: '',
        //           Viseral: '',
        //           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        //           userImg: null,
        //         });
        //       });
        //   } catch (e) {
        //     const errorMes = firebaseErrors[e.code];
        //     alert(errorMes);
        //     console.log(errorMes);
        //   }
        // },
        register: async (email, password) => {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                console.log(firebase.auth().currentUser.uid);
                db.doc(firebase.auth().currentUser.uid).set({
                  userId: firebase.auth().currentUser.uid,
                  password,
                  email: email,

                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
              });
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(errorMes);
            console.log(e);
          }
        },
        addNote: async (title, text, id) => {
          console.log("note being added", title, text, id);
          try {
            await db.doc(id).collection("Member Notes").doc().set(
              {
                title: title,
                note: text,
                ownerId: id,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(e);
            console.log(e);
          }
        },
        editNote: async (title, text, id, noteId) => {
          console.log("note being edited", title, text, id);
          try {
            await db.doc(id).collection("Member Notes").doc(noteId).set(
              {
                title: title,
                note: text,
                ownerId: id,
                // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(errorMes);
            console.log(errorMes);
          }
        },
        updateNote: async (title, data, key, section, id, chosen, pdfData) => {
          console.log("note being updated", title, data, id);
          const newTitle = title.concat(chosen);
          // let newBool;
          // let bool;
          // if (chosen === "si") {
          //   bool = true;
          //   newBool = false;
          // }
          // if (chosen === "no") {
          //   bool = false;
          //   newBool = true;
          // }
          try {
            await db.doc(id).collection(section).doc(key).set(
              {
                title: title,
                data: data,
                chosen: chosen,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .set(
                {
                  [title]: data,
                },
                { merge: true }
              );
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .update({
                [pdfData]: firebase.firestore.FieldValue.delete(),
              });
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .set(
                {
                  [newTitle]: true,
                },
                { merge: true }
              );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(e);
            console.log(e);
          }
        },
        newNote: async (title, data, section, id, checkable) => {
          console.log("note being updated", title, data, id);
          try {
            await db.doc(id).collection(section).doc().set(
              {
                checkable: checkable,
                title: title,
                data: data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .set(
                {
                  [title]: data,
                },
                { merge: true }
              );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(e);
            console.log(e);
          }
        },
        newNoteCheck: async (
          title,
          data,
          checkSi,
          checkNo,
          section,
          id,
          checkable
        ) => {
          let answer;
          let result;
          let join;

          if (checkSi === true) {
            join = "si";
          }
          if (checkNo === true) {
            join = "no";
          }
          answer = true;
          // answerSi = checkSi === true ? "si" : "no";
          // answerNo = checkNo ? "si" : "no";
          // answer = answerSi === "si" ? "si" : "no";
          result = title.concat(join);
          try {
            await db
              .doc(id)
              .collection(section)
              .doc()
              .set(
                {
                  chosen: join,
                  [result]: answer,
                  checkable: checkable,
                  title: title,
                  data: data,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .set(
                {
                  [title]: data,
                },
                { merge: true }
              );
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .set(
                {
                  [result]: answer,
                },
                { merge: true }
              );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(e);
            console.log(e);
          }
        },
        readUpdate: async (key, boolean) => {
          try {
            // console.log("uploading expo token", expoPushToken);

            await dbN
              .doc("Mayra")
              .collection("Client Notifications")
              .doc(key)
              .set(
                {
                  read: boolean,

                  readDate: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(errorMes);
            console.log(errorMes);
          }
        },
        addToken: async (expoPushToken) => {
          try {
            console.log("uploading expo token", expoPushToken);

            await dbN.doc("Mayra").collection("User Info").doc().set(
              {
                expoPushToken,

                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            const errorMes = firebaseErrors[e.code];
            alert(errorMes);
            console.log(errorMes);
          }
        },
        deleteData: async (screen, id, header, pdfData, key) => {
          console.log("deleteing eval", screen, id, pdfData);
          try {
            await db.doc(id).collection(screen).doc(key).delete();
            await db
              .doc(id)
              .collection("PdfData")
              .doc(id)
              .update({
                [header]: firebase.firestore.FieldValue.delete(),
                [pdfData]: firebase.firestore.FieldValue.delete(),
              });
          } catch (e) {
            console.log(e);
          }
        },
        deleteNote: async (docId, id) => {
          console.log("deleteing eval", docId, id);
          try {
            await db.doc(id).collection("Member Notes").doc(docId).delete();
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
