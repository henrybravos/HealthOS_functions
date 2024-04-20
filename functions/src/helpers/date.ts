import {DateTime} from "luxon";
export const convertDate = (date: Date) => {
  return DateTime.fromJSDate(date, {
    zone: "America/Lima",
  }).toFormat("yyyy-MM-dd HH:mm:ss");
};
