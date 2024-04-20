import {createTransport} from "nodemailer";
export const getTransport = () => {
  return createTransport({
    service: "gmail",
    auth: {
      user: "hbravos.info@gmail.com",
      pass: "xrkm ouzy cqzj flzm",
    },
  });
};
