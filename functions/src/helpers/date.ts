import {DateTime} from "luxon";
const optionsConvert = {
  zone: "America/Lima",
};
export const convertDateYYYYMMddHHmmss = (date: Date) => {
  return DateTime.fromJSDate(date, optionsConvert).toFormat("yyyy-MM-dd HH:mm:ss");
};
export const convertDateYYYYMM = (date: Date) => {
  return DateTime.fromJSDate(date, optionsConvert).toFormat("yyyy-MM");
};
