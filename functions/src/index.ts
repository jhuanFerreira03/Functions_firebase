import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {onDocumentUpdated, Change, FirestoreEvent,} from "firebase-functions/v2/firestore"

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
      data.endereco != undefined &&
      data.curriculo != undefined) {
      try {
        await app.firestore().collection("Users").add(data);
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

export const triggerNotifi = 
  onDocumentUpdated("emergencias/{emergenciaId}", (event) => {
    const data = event.data;
    if (data !== undefined) {
      const newValue = data.after.data();
      if (newValue.status == "new"){
        admin.app().firestore().collection("Users").get();
      }
    }
  });
