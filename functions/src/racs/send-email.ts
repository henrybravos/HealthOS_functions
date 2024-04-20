import SMTPTransport = require("nodemailer/lib/smtp-transport")
import {generateHTMLRacs} from "../format/email-racs";
import {getExtension, getTransport} from "../helpers";
import {Racs} from "../types";
const transport = getTransport();
type ReturnSendEmail = Promise<SMTPTransport.SentMessageInfo>
/**
 * Sends an email with RACS data to the specified email addresses.
 * @param {string[]} emails - An array of email addresses to send the email to.
 * @param {Racs} data - The RACS data to include in the email.
 * @return {ReturnSendEmail} A promise that resolves when the email is sent.
 */
const sendEmailRacs = async (emails: string[], data: Racs): ReturnSendEmail => {
  const attachments: { path: string; filename: string }[] = [];
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
    to: emails,
    html: generateHTMLRacs(data),
    subject,
    attachments,
  };
  return await transport.sendMail(mailOptions);
};
export {sendEmailRacs};
