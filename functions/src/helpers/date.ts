import {DateTime} from "luxon";
const optionsConvert = {
  zone: "America/Lima",
};
export const convertDateYYYYMMddHHmmss = (date: Date) => {
  const dateTime = DateTime.fromJSDate(date, optionsConvert);
  return dateTime.toFormat("yyyy-MM-dd HH:mm:ss");
};
export const convertDateYYYYMM = (date: Date) => {
  const dateTime = DateTime.fromJSDate(date, optionsConvert);
  return dateTime.toFormat("yyyy-MM");
};
