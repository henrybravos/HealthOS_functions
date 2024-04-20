import {initializeApp} from "firebase-admin/app";
import {firestore} from "firebase-functions";
import {Racs} from "./types/index";
import {sendEmailRacs} from "./racs/send-email";

const emails = ["hbravos.info@gmail.com", "wgallardo@cip.org.pe"];

initializeApp();
const docReference = firestore.document("racs/{documentId}");
exports.sendUpdateRacs = docReference.onUpdate(async (snap) => {
  const data = snap.after.data() as Racs;
  await sendEmailRacs(emails, data);
  return null;
});
exports.sendCreateRacs = docReference.onCreate(async (snap) => {
  const data = snap.data() as Racs;
  await sendEmailRacs(emails, data);
  return null;
});
