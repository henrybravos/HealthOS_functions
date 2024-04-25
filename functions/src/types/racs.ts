import {Timestamp} from "firebase-admin/firestore";
import {
  ClassificationEvent,
  Company,
  EventType,
  Place,
  UnsafeActCondition,
  UserInfo,
} from "./index";

export enum StatusRacs {
  CLOSED = "CERRADO",
  PENDING = "PENDIENTE",
}
export enum TypeRacs {
  ACT = "ACTO SUB.",
  CONDITION = "CONDICIÓN SUBÉSTANTAR",
  INCIDENT = "INCIDENTE",
  GOOD_PRACTICE = "BUENA PRÁCTICA",
}
export type EvidenceRacs = {
  openUri?: string;
  closeUri?: string;
};
export type Racs = {
  id: string;
  createdAt: Timestamp;
  openAt: Timestamp;
  closeAt?: Timestamp;
  deletedAt?: Timestamp;
  act?: UnsafeActCondition;
  user: UserInfo;
  type: TypeRacs;
  place: Place;
  company: Company;
  evidence: EvidenceRacs;
  eventType: EventType;
  condition?: UnsafeActCondition;
  description: string;
  classification: ClassificationEvent;
  controlCondition: string;
  status: StatusRacs;
};
export type RacsUser = {
  month: string;
  userId: string;
  racsIds: string[];
  racsGoal: number;
  racsQuantity: number;
};
