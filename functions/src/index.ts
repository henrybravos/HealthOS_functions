import {initializeApp, getApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {firestore} from "firebase-functions";
import {Racs, UserInfo} from "./types/index";
import {sendEmailRacs} from "./racs/send-email";

const emails = ["hbravos.info@gmail.com", "wgallardo@cip.org.pe"];

initializeApp();
const docRacsReference = firestore.document("racs/{documentId}");
const docUserReference = firestore.document("users_info/{documentId}");
exports.sendUpdateRacs = docRacsReference.onUpdate(async (snap) => {
  const data = snap.after.data() as Racs;
  await sendEmailRacs(emails, data);
  return null;
});
exports.sendCreateRacs = docRacsReference.onCreate(async (snap) => {
  const data = snap.data() as Racs;
  await sendEmailRacs(emails, data);
  return null;
});
exports.createUser = docUserReference.onCreate(async (snap) => {
  const user = snap.data() as UserInfo;
  const auth = getAuth(getApp());
  try {
    const userAuth = await auth.createUser({
      email: user.email,
      emailVerified: true,
      password: user.password ?? user.dni,
      displayName: `${user.name} ${user.surname}`,
      disabled: user.deletedAt ? true : false,
    });
    await auth.setCustomUserClaims(userAuth.uid, {...user});
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
