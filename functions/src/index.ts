import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const app = admin.initializeApp();
// const db = app.firestore();

const region = "southamerica-east1";

type User = {
  uid: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  curriculo: string;
  fcmToken: string | unknown
  status: boolean;
};

type Response = {
  status: string | unknown;
  message: string | unknown;
  payload: unknown
};
// Start writing functions
// https://firebase.google.com/docs/functions/typescript


export const addUsers = functions
  .region(region).https
  .onCall(async (data: User, context) => {
    const Res:Response = {
      status: "",
      message: "",
      payload: undefined,
    };
    if (data.nome != undefined &&
      data.email != undefined &&
      data.telefone != undefined &&
      data.uid != undefined &&
      data.endereco!= undefined &&
      data.curriculo != undefined) {
      try {
        await app.firestore().collection("Dentistas").add(data);
        Res.status = "Ok";
        Res.message = "Aparentemente foi";
        return Res;
      } catch (error) {
        Res.status = "Erro";
        Res.message = "Aparentemente não foi";
        return Res;
      }
    } else {
      return Res;
    }
  });

export const triggerNotifi = functions.region(region).firestore
  .document("Emergencias/{id}")
  .onCreate(async (snap, context) => {
    const doc = snap.data();
    const message = {
      data: {
        title: "Emergencia",
        nome: doc.nome,
        telefone: doc.telefone,
      },
      token: "fcmtoken",
    };
    const result = await admin.app().firestore()
      .collection("Dentistas").where("status", "==", true).get();
    result.forEach((doc) => {
      message.token = doc.data().fcmToken.toString();
      admin.messaging().send(message)
        .then((res) => {
          console.log("message mandada: " + res + " " + doc.data()
            .fcmToken.toString());
        }).catch((e) => {
          console.log("message error: " + e + " " + doc);
        });
    });
  });
