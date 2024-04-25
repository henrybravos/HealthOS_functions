import {convertDateYYYYMM} from "../helpers";
import {Racs, RacsUser, UserInfo} from "../types";
import {COLLECTIONS} from "../const/collections";
import {Firestore} from "firebase-admin/firestore";

const createOrPushRacsUserReport = async (db: Firestore, racs: Racs) => {
  const YYmm = convertDateYYYYMM(racs.openAt.toDate() || new Date());
  const racsUserDoc = await db
    .collection(COLLECTIONS.reports)
    .doc(COLLECTIONS.racs)
    .collection(YYmm)
    .doc(racs.user.id)
    .get();
  if (racsUserDoc.exists) {
    const updateRacsUser = racsUserDoc.data() as RacsUser;
    const existRacs = updateRacsUser.racsIds.some((id) => id === racs.id);
    if (!existRacs) {
      updateRacsUser.racsIds.push(racs.id);
      updateRacsUser.racsQuantity += 1;
    }
    return await racsUserDoc.ref.set(updateRacsUser, {merge: true});
  } else {
    const collectionUserInfo = db.collection(COLLECTIONS.usersInfo);
    const userDoc = await collectionUserInfo.doc(racs.user.id).get();
    const user = userDoc.data() as UserInfo;
    const newRacsUser: RacsUser = {
      month: YYmm,
      userId: racs.user.id,
      racsIds: [racs.id],
      racsGoal: user.racsGoals || 0,
      racsQuantity: 1,
    };
    return await db
      .collection(COLLECTIONS.reports)
      .doc(COLLECTIONS.racs)
      .collection(YYmm)
      .doc(racs.user.id)
      .set(newRacsUser);
  }
};
const removeRacsUserReport = async (db: Firestore, racs: Racs) => {
  const YYmm = convertDateYYYYMM(racs.openAt.toDate());
  const racsUserDoc = await db
    .collection(COLLECTIONS.reports)
    .doc(COLLECTIONS.racs)
    .collection(YYmm)
    .doc(racs.user.id)
    .get();
  if (racsUserDoc.exists) {
    const updateRacsUser = racsUserDoc.data() as RacsUser;
    const newRacs = updateRacsUser.racsIds.filter((id) => id !== racs.id);
    if (newRacs.length === updateRacsUser.racsIds.length - 1) {
      updateRacsUser.racsQuantity -= 1;
      updateRacsUser.racsIds = newRacs;
      return await racsUserDoc.ref.set(updateRacsUser, {merge: true});
    }
  }
  return null;
};
export {createOrPushRacsUserReport, removeRacsUserReport};
