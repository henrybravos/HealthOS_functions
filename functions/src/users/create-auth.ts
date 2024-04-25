import {getAuth} from "firebase-admin/auth";
import {getApp} from "firebase-admin/app";
import {UserInfo} from "../types";

const createUserAuthAndProfile = async (user: UserInfo) => {
  const auth = getAuth(getApp());
  const userAuth = await auth.createUser({
    email: user.email,
    emailVerified: true,
    password: user.password ?? user.dni,
    displayName: `${user.name} ${user.surname}`,
    disabled: user.deletedAt ? true : false,
  });
  await auth.setCustomUserClaims(userAuth.uid, {...user});
  return userAuth;
};
export {createUserAuthAndProfile};
