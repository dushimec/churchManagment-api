import { Language } from "@prisma/client"
import nodemailer from "nodemailer";
import { logger } from "../utils/logger";
import moment from "moment";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const baseEmailTemplate = (
  content: string,
  language: Language = Language.EN
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evangelical Restoration Church</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1A1A1A;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      padding: 0;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .header {
      background: #B91C1C;
      color: white;
      padding: 30px 30px 20px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 15px;
      opacity: 0.95;
      font-weight: 500;
    }
    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 15px;
      display: block;
    }
    .content {
      padding: 40px 30px;
      color: #1A1A1A;
    }
    .button {
      display: inline-block;
      background: #B91C1C;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
      transition: background 0.3s;
    }
    .button:hover {
      background: #991515;
    }
    .footer {
      text-align: center;
      padding: 30px;
      background: #f8f9fa;
      color: #555;
      font-size: 13px;
      border-top: 1px solid #eaeaea;
    }
    .verification-code {
      background-color: #FFF5F5;
      padding: 20px;
      border: 2px dashed #B91C1C;
      border-radius: 8px;
      text-align: center;
      font-size: 28px;
      font-weight: 800;
      margin: 25px 0;
      color: #B91C1C;
      letter-spacing: 3px;
      font-family: monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
    }
    th, td {
      padding: 14px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #FFF5F5;
      color: #B91C1C;
      font-weight: 600;
    }
    ul {
      padding-left: 24px;
    }
    ul li {
      margin-bottom: 10px;
      line-height: 1.5;
    }
    blockquote {
      background: #FFF5F5;
      border-left: 4px solid #B91C1C;
      padding: 16px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- LOGO -->
      <img src="${process.env.LOGO_URL}" alt="Evangelical Restoration Church" class="logo" />
      <h1>Evangelical Restoration Church</h1>
      <p>${language === Language.FR
    ? "Rétablissant les âmes, ensemble en Christ"
    : "Restoring Souls, Together in Christ"
  }</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Evangelical Restoration Church. ${language === Language.FR ? "Tous droits réservés." : "All rights reserved"
  }.</p>
      <p>${language === Language.FR
    ? "Où la grâce rencontre la transformation."
    : "Where grace meets transformation."
  }</p>
    </div>
  </div>
</body>
</html>
`;


export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Evangelical Restoration Church" ${process.env.SMTP_FROM}`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  language: Language = Language.EN,
  type: "signup" | "login" = "signup"
) => {
  let subject: string;
  let content: string;

  if (type === "login") {
    subject =
      language === Language.FR
        ? "Vérification de connexion - Église Évangélique de Restauration"
        : "Login Verification - Evangelical Restoration Church";
    content =
      language === Language.FR
        ? `
        <h2>Connexion à votre compte</h2>
        <p>Pour des raisons de sécurité, veuillez entrer le code ci-dessous pour accéder à votre compte :</p>
        <div class="verification-code">${verificationCode}</div>
        <p>Ce code expirera dans 10 minutes. Si vous n’avez pas tenté de vous connecter, veuillez contacter notre équipe.</p>
        <p>Bénédiction,<br>L'équipe d'Église Évangélique de Restauration</p>
      `
        : `
        <h2>Login to Your Account</h2>
        <p>For your security, please enter the code below to access your account:</p>
        <div class="verification-code">${verificationCode}</div>
        <p>This code will expire in 10 minutes. If you didn’t attempt to log in, please contact our team.</p>
        <p>Blessings,<br>The Evangelical Restoration Church Team</p>
      `;
  } else {
    subject =
      language === Language.FR
        ? "Vérifiez votre compte - Église Évangélique de Restauration"
        : "Verify Your Account - Evangelical Restoration Church";
    content =
      language === Language.FR
        ? `
        <h2>Bienvenue dans la famille de l'Église Évangélique de Restauration !</h2>
        <p>Merci de rejoindre notre communauté de foi. Pour activer votre compte, veuillez utiliser le code ci-dessous :</p>
        <div class="verification-code">${verificationCode}</div>
        <p>Ce code expirera dans 24 heures. Si vous n’avez pas créé ce compte, veuillez ignorer cet e-mail.</p>
        <p>Nous sommes ravis de vous accueillir !<br>L'équipe d'Église Évangélique de Restauration</p>
      `
        : `
        <h2>Welcome to the Evangelical Restoration Church Family!</h2>
        <p>Thank you for joining our faith community. To activate your account, please use the code below:</p>
        <div class="verification-code">${verificationCode}</div>
        <p>This code will expire in 24 hours. If you didn’t create this account, please ignore this email.</p>
        <p>We’re so glad you’re here!<br>The Evangelical Restoration Church Team</p>
      `;
  }

  return await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  language: Language = Language.EN
): Promise<boolean> => {
  const subject =
    language === Language.FR
      ? "Bienvenue à l'Église Évangélique de Restauration – Ensemble en Christ !"
      : "Welcome to Evangelical Restoration Church – Together in Christ!";

  const content =
    language === Language.FR
      ? `
      <h2>Merci d’avoir rejoint notre famille spirituelle 🙏</h2>
      
      <p>Cher(e) ${name},</p>
      <p>Bienvenue à l'Église Évangélique de Restauration — un lieu où les âmes sont restaurées, les cœurs guéris, et la foi ravivée.</p>
      
      <p>En tant que membre, vous pouvez :</p>
      
      <ul>
        <li>Participer à nos cultes et études bibliques</li>
        <li>S'inscrire à des événements et retraites spirituelles</li>
        <li>Faire des demandes de prière confidentielles</li>
        <li>Soutenir la mission de l’église par vos dons</li>
        <li>Rejoindre un ministère (louange, accueil, enseignement…)</li>
      </ul>
      
      <p>Nous prions pour que Dieu vous bénisse abondamment dans ce nouveau chapitre.</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Accéder à votre tableau de bord</a>
      
      <p>Avec amour et prière,<br>L'équipe pastorale</p>
    `
      : `
      <h2>Thank you for joining our spiritual family 🙏</h2>
      
      <p>Dear ${name},</p>
      <p>Welcome to Evangelical Restoration Church — a place where souls are restored, hearts healed, and faith renewed.</p>
      
      <p>As a member, you can:</p>
      
      <ul>
        <li>Attend worship services and Bible studies</li>
        <li>Register for spiritual events and retreats</li>
        <li>Submit confidential prayer requests</li>
        <li>Support the church’s mission through giving</li>
        <li>Join a ministry (praise, ushering, teaching…)</li>
      </ul>
      
      <p>We pray God richly blesses you in this new chapter.</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Your Dashboard</a>
      
      <p>With love and prayer,<br>The Pastoral Team</p>
    `;

  return await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  language: Language = Language.EN
) => {
  const subject =
    language === Language.FR
      ? "Réinitialisation de votre mot de passe - Église Évangélique de Restauration"
      : "Reset Your Password - Evangelical Restoration Church";

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const content =
    language === Language.FR
      ? `
      <h2>Réinitialisation du mot de passe</h2>
      <p>Nous avons reçu une demande de réinitialisation pour votre compte.</p>

      <p><strong>Sur mobile :</strong> copiez le code ci-dessous</p>
      <div class="verification-code">${resetToken}</div>
      <p><strong>Sur ordinateur :</strong> cliquez sur le bouton ci-dessous</p>

      <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>

      <p>Ce lien et ce code expireront dans 1 heure. Si vous n’avez pas fait cette demande, veuillez nous contacter.</p>
      <p>Bénédiction,<br>L'équipe technique</p>
    `
      : `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your account password.</p>

      <p><strong>On mobile:</strong> copy the code below</p>
      <div class="verification-code">${resetToken}</div>
      <p><strong>On desktop:</strong> click the button below</p>

      <a href="${resetLink}" class="button">Reset My Password</a>

      <p>This link and code will expire in 1 hour. If you didn’t request this, please contact us.</p>
      <p>Blessings,<br>The Tech Team</p>
    `;

  await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendPasswordResetConfirmationEmail = async (
  email: string,
  name: string,
  language: Language = Language.EN
) => {
  const subject =
    language === Language.FR
      ? "Votre mot de passe a été réinitialisé - Église Évangélique de Restauration"
      : "Your Password Has Been Reset - Evangelical Restoration Church";
  const content =
    language === Language.FR
      ? `
    <h2>Mot de passe mis à jour ✅</h2>
    
    <p>Bonjour ${name},</p>
    
    <p>Votre mot de passe a été réinitialisé avec succès. Si c’était vous, aucune autre action n’est requise.</p>
    
    <p>Si vous n’avez pas effectué cette modification, veuillez <strong>nous contacter immédiatement</strong> pour sécuriser votre compte.</p>
    
    <a href="${process.env.FRONTEND_URL}/login" class="button">Se connecter maintenant</a>
    
    <p>Pour votre sécurité :</p>
    <ul>
      <li>Utilisez un mot de passe unique</li>
      <li>Ne partagez pas vos identifiants</li>
    </ul>
    
    <p>Que Dieu vous garde,<br>L'équipe d'Église Évangélique de Restauration</p>
  `
      : `
    <h2>Password Updated Successfully ✅</h2>
    
    <p>Hello ${name},</p>
    
    <p>Your password has been successfully reset. If this was you, no further action is needed.</p>
    
    <p>If you didn’t make this change, please <strong>contact us immediately</strong> to secure your account.</p>
    
    <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
    
    <p>For your security:</p>
    <ul>
      <li>Use a unique password</li>
      <li>Don’t share your credentials</li>
    </ul>
    
    <p>God bless,<br>The Evangelical Restoration Church Team</p>
  `;

  await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendDonationReceiptEmail = async (
  email: string,
  donorName: string,
  receiptNumber: string,
  donationDate: string,
  paymentMethod: string,
  currency: string,
  items: Array<{
    name: string;
    amount: number;
  }>,
  totalAmount: number,
  language: Language = Language.EN
) => {
  const subject =
    language === Language.FR
      ? `Reçu de don - ${receiptNumber}`
      : `Donation Receipt - ${receiptNumber}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === Language.FR ? "fr-FR" : "en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 14px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 14px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
        item.amount
      )}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div style="max-width: 650px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div class="header" style="background: #B91C1C; color: white; padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">Evangelical Restoration Church</h1>
        <p style="margin: 10px 0 0 0; font-size: 15px; opacity: 0.95;">${language === Language.FR ? "Reçu de don" : "Donation Receipt"
    }</p>
      </div>

      <div class="content" style="padding: 40px 30px; background: white;">
        <div style="background: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #f0d0d0;">
          <h2 style="margin: 0; color: #B91C1C; font-size: 22px;">${language === Language.FR ? "REÇU" : "RECEIPT"
    } #${receiptNumber}</h2>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
          <div>
            <p><strong>${language === Language.FR ? "Donateur" : "Donor"
    }:</strong> ${donorName}</p>
            <p><strong>${language === Language.FR ? "Date" : "Date"
    }:</strong> ${donationDate}</p>
          </div>
          <div>
            <p><strong>${language === Language.FR ? "Méthode" : "Method"
    }:</strong> ${paymentMethod}</p>
            <p><strong>${language === Language.FR ? "Devise" : "Currency"
    }:</strong> ${currency}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr>
              <th style="padding: 14px; text-align: left; border-bottom: 2px solid #B91C1C; color: #B91C1C;">${language === Language.FR ? "Description" : "Description"
    }</th>
              <th style="padding: 14px; text-align: right; border-bottom: 2px solid #B91C1C; color: #B91C1C;">${language === Language.FR ? "Montant" : "Amount"
    }</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; padding: 20px 0; border-top: 3px solid #B91C1C; margin-top: 20px;">
          <div style="font-size: 22px; font-weight: 800; color: #B91C1C;">
            <span style="margin-right: 30px;">${language === Language.FR ? "TOTAL" : "TOTAL"
    }:</span>
            <span>${formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <p style="font-style: italic; color: #555; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #eee;">
          ${language === Language.FR ? "Votre générosité soutient la restauration des âmes et l'avancement du Royaume de Dieu." : "Your generosity supports soul restoration and the advancement of God’s Kingdom."}
        </p>
      </div>

      <div class="footer" style="text-align: center; padding: 30px; background: #f8f9fa; color: #555; font-size: 13px; border-radius: 0 0 12px 12px;">
        <p>© ${new Date().getFullYear()} Evangelical Restoration Church. ${language === Language.FR ? "Tous droits réservés." : "All rights reserved"
    }.</p>
        <p>${language === Language.FR
      ? "Où la grâce rencontre la transformation."
      : "Where grace meets transformation."
    }</p>
      </div>
    </div>
  `;

  return await sendEmail(email, subject, content);
};

export const sendSuspensionEmail = async (
  email: string,
  name: string,
  language: Language = Language.EN,
  reason?: string,
  recoveryDate?: Date
): Promise<boolean> => {
  const subject =
    language === Language.FR
      ? "Notification de suspension de votre compte"
      : "Notice of Account Suspension";

  const formattedRecovery =
    recoveryDate && moment(recoveryDate).isValid()
      ? moment(recoveryDate).format("LL")
      : null;

  const recoveryMessageFR = formattedRecovery
    ? `<p>Votre accès sera rétabli le <strong>${formattedRecovery}</strong>, sauf avis contraire.</p>`
    : "";

  const recoveryMessageEN = formattedRecovery
    ? `<p>Your access will be restored on <strong>${formattedRecovery}</strong>, unless otherwise notified.</p>`
    : "";

  const content =
    language === Language.FR
      ? `
      <h2>Accès temporairement suspendu</h2>
      
      <p>Cher(e) ${name},</p>
      <p>Votre compte sur la plateforme de l'Église Évangélique de Restauration a été temporairement suspendu pour la raison suivante :</p>
      
      <blockquote>
        ${reason || "Violation des directives communautaires"}
      </blockquote>
      
      ${recoveryMessageFR}
      
      <p>Pour toute question ou pour faire appel, contactez l’équipe pastorale.</p>
      
      <p>Dans l’espérance et la prière,<br>L'équipe d'Église Évangélique de Restauration</p>
    `
      : `
      <h2>Account Temporarily Suspended</h2>
      
      <p>Dear ${name},</p>
      <p>Your account on the Evangelical Restoration Church platform has been temporarily suspended for the following reason:</p>
      
      <blockquote>
        ${reason || "Violation of community guidelines"}
      </blockquote>
      
      ${recoveryMessageEN}
      
      <p>For questions or to appeal, please contact the pastoral team.</p>
      
      <p>In hope and prayer,<br>The Evangelical Restoration Church Team</p>
    `;

  return await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendAccountRecoveryEmail = async (
  email: string,
  name: string,
  language: Language = Language.EN
): Promise<boolean> => {
  const subject =
    language === Language.FR
      ? "Votre compte a été rétabli"
      : "Your Account Has Been Restored";

  const content =
    language === Language.FR
      ? `
      <h2>Bienvenue de retour !</h2>
      
      <p>Cher(e) ${name},</p>
      <p>Nous sommes heureux de vous informer que votre compte a été rétabli. Vous pouvez à nouveau accéder à tous les services de la plateforme.</p>
      
      <p>Merci pour votre patience. Nous prions pour vous chaque jour.</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Accéder à mon compte</a>
      
      <p>Avec amour en Christ,<br>L'équipe d'Église Évangélique de Restauration</p>
    `
      : `
      <h2>Welcome Back!</h2>
      
      <p>Dear ${name},</p>
      <p>We’re pleased to inform you that your account has been restored. You may now access all platform features again.</p>
      
      <p>Thank you for your patience. We pray for you daily.</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to My Account</a>
      
      <p>With love in Christ,<br>The Evangelical Restoration Church Team</p>
    `;

  return await sendEmail(email, subject, baseEmailTemplate(content, language));
};

export const sendFormStatusEmail = async (
  email: string,
  name: string,
  formType: string,
  status: "APPROVED" | "REJECTED",
  language: Language = Language.EN,
  reason?: string
): Promise<boolean> => {
  const isApproved = status === "APPROVED";
  const subject =
    language === Language.FR
      ? `Mise à jour de votre demande - ${formType} - ${isApproved ? "Approuvée" : "Rejetée"}`
      : `Update on your request - ${formType} - ${isApproved ? "Approved" : "Rejected"}`;

  const content =
    language === Language.FR
      ? `
      <h2>Mise à jour du statut de votre demande</h2>
      
      <p>Cher(e) ${name},</p>
      <p>Votre demande de <strong>${formType}</strong> a été <strong>${isApproved ? "approuvée ✅" : "rejetée ❌"}</strong>.</p>
      
      ${!isApproved && reason ? `<blockquote>Raison : ${reason}</blockquote>` : ""}
      
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      
      <p>Cordialement,<br>L'équipe d'Église Évangélique de Restauration</p>
    `
      : `
      <h2>Request Status Update</h2>
      
      <p>Dear ${name},</p>
      <p>Your request for <strong>${formType}</strong> has been <strong>${isApproved ? "approved ✅" : "rejected ❌"}</strong>.</p>
      
      ${!isApproved && reason ? `<blockquote>Reason: ${reason}</blockquote>` : ""}
      
      <p>If you have any questions, please feel free to contact us.</p>
      
      <p>Best regards,<br>The Evangelical Restoration Church Team</p>
    `;

  return await sendEmail(email, subject, baseEmailTemplate(content, language));
};
