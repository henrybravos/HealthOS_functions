import SMTPTransport = require("nodemailer/lib/smtp-transport");
import {generateHTMLRacs} from "../format/email-racs";
import {getExtension, getTransport} from "../helpers";
import {Racs} from "../types";
import {Firestore} from "firebase-admin/firestore";
import {COLLECTIONS, EMAILS_TO_SEND} from "../const";
const transport = getTransport();
type ReturnSendEmail = Promise<SMTPTransport.SentMessageInfo>;
/**
 * Sends an email with RACS data to the specified email addresses.
 * @param {Firestore} db - An array of email addresses to send the email to.
 * @param {Racs} data - The RACS data to include in the email.
 * @return {ReturnSendEmail} A promise that resolves when the email is sent.
 */
const sendEmailRacs = async (db: Firestore, data: Racs): ReturnSendEmail => {
  const docConfig = db.collection(COLLECTIONS.config).doc("00000000000");
  const config = await docConfig.get();
  const emails: string[] = config.data()?.emailsDefault || [];
  const attachments: {path: string; filename: string}[] = [];
  const getAttachment = (path: string, filename: string) => {
    return {path, filename};
  };
  if (data.evidence.closeUri) {
    const ext = getExtension(data.evidence.closeUri);
    const attachment = getAttachment(data.evidence.closeUri, `CERRADO.${ext}`);
    attachments.push(attachment);
  }
  if (data.evidence.openUri) {
    const ext = getExtension(data.evidence.openUri);
    const attachment = getAttachment(data.evidence.openUri, `PENDIENTE.${ext}`);
    attachments.push(attachment);
  }

  const subject = data.status === "CERRADO" ? "RAC cerrado" : "RAC creado";
  const mailOptions = {
    from: data.user.email,
    to: emails.length > 0 ? emails : EMAILS_TO_SEND,
    html: generateHTMLRacs(data),
    subject,
    attachments,
  };
  return await transport.sendMail(mailOptions);
};
export {sendEmailRacs};
