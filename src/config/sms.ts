import { Twilio } from "twilio";
import { PindoSMS } from 'pindo-sms';


const pindoToken = String(process.env.PINDO_ACCESS_TOKEN);

export const pindoSMS = new PindoSMS(pindoToken);

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

export default client;
