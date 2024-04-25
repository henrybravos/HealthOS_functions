import {initializeApp, getApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {firestore as firestoreDb} from "firebase-admin";
import {firestore} from "firebase-functions";
import {Racs, UserInfo} from "./types/index";
import {sendEmailRacs} from "./racs/send-email";
import {createUserAuthAndProfile} from "./users/create-auth";
import {createOrPushRacsUserReport, removeRacsUserReport} from "./users/racs-user-report";
import {EMAILS_TO_SEND, COLLECTIONS} from "./const";

initializeApp();
const db = firestoreDb();
const docRacsReference = firestore.document(`${COLLECTIONS.racs}/{documentId}`);
const docUserReference = firestore.document(`${COLLECTIONS.usersInfo}/{documentId}`);
exports.createRacs = docRacsReference.onCreate(async (snap) => {
  const racs = snap.data() as Racs;
  racs.id = snap.id;
  await sendEmailRacs(EMAILS_TO_SEND, racs);
  await createOrPushRacsUserReport(db, racs);
  return null;
});
exports.updateRacs = docRacsReference.onUpdate(async (snap) => {
  const afterRacs = snap.after.data() as Racs;
  const beforeRacs = snap.before.data() as Racs;
  afterRacs.id = snap.after.id;
  beforeRacs.id = snap.before.id;
  if (!afterRacs.deletedAt) {
    await sendEmailRacs(EMAILS_TO_SEND, afterRacs);
  }
  if (!beforeRacs.deletedAt && afterRacs.deletedAt) {
    await removeRacsUserReport(db, afterRacs);
  }
  if (beforeRacs.deletedAt && !afterRacs.deletedAt) {
    await createOrPushRacsUserReport(db, afterRacs);
  }
  return null;
});
exports.deleteRacs = docRacsReference.onDelete(async (snap) => {
  const racs = snap.data() as Racs;
  racs.id = snap.id;
  await removeRacsUserReport(db, racs);
  return null;
});
exports.createUser = docUserReference.onCreate(async (snap) => {
  const user = snap.data() as UserInfo;
  user.id = snap.id;
  try {
    const userAuth = await createUserAuthAndProfile(user);
    await snap.ref.set({authId: userAuth.uid, password: "****"}, {merge: true});
  } catch (error) {
    console.error("Error creating new user auth:", error);
    await snap.ref.delete();
  }
  return null;
});
exports.updateUser = docUserReference.onUpdate(async (snap) => {
  const userBefore = snap.before.data() as UserInfo;
  const userAfter = snap.after.data() as UserInfo;
  if (!userBefore.deletedAt && userAfter.deletedAt) {
    const auth = getAuth(getApp());
    auth.updateUser(userAfter.authId, {disabled: true});
  }
  if (userBefore.deletedAt && !userAfter.deletedAt) {
    const auth = getAuth(getApp());
    auth.updateUser(userAfter.authId, {disabled: false});
  }
  return null;
});
