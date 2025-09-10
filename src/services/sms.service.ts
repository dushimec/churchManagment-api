import { Language } from "@prisma/client";
import client, { pindoSMS } from "../config/sms";
import { logger } from "../utils/logger";

const pindo_sender_id = process.env.PINDO_SENDER_ID || "PindoTest";
export interface Recipient {
  phonenumber: string;
  name: string;
}

export class SmsService {
  static async sendSmsViaPindo(
    phoneNumber: string,
    message: string
  ): Promise<boolean> {
    try {
     await pindoSMS.sendSMS({
        to: phoneNumber,
        text: message,
        sender: pindo_sender_id,
      });

      logger.info(`SMS successfully sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      logger.error("Error sending sms", error);
      return false;
    }
  }

  static sendVerificationSMS = async (
  phoneNumber: string,
  verificationCode: string,
  language: Language = Language.EN
) => {

  try {
    const message =
      language === Language.FR
        ? `CoRoute: Votre code de vérification est: ${verificationCode}. Ce code expirera dans 24 heures.`
        : `CoRoute: Your verification code is: ${verificationCode}. This code will expire in 24 hours.`;

    await client.messages.create({
      body: message,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    logger.info(`Verification SMS sent to ${phoneNumber}`);
  } catch (error) {
    logger.error("Error sending verification SMS:", error);
    throw error;
  }
};
}
