import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/CatchAsync";
import { Role, AssetType, AssetCategory, Language } from "@prisma/client";
import { generateVerificationCode } from "../utils/generateVerificatinCode";
import { matchedData } from "express-validator";
import { generateAvatar } from "../utils/generateAvatar";
import { uploadToCloudinary } from "../utils/cloudinary";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { SmsService } from "../services/sms.service";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
} from "../config/email";

export class AuthController {
 static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    } = matchedData<{
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
      role?: Role;
    }>(req);

    const isEN = req.isEnglishPreferred || true;

    const existingUser = await prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (existingUser) {
      return next(AppError(isEN ? "Email already in use." : "Courriel déjà utilisé.", 409));
    }

    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone, isDeleted: false } });
      if (phoneExists) {
        return next(AppError(isEN ? "Phone already in use." : "Téléphone déjà utilisé.", 409));
      }
    }

    let assignedRole: Role = Role.MEMBER;

    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.ADMIN, isDeleted: false },
    });

    if (!existingAdmin) {
      assignedRole = Role.ADMIN;
    } else {
      if (role === Role.ADMIN) {
        return next(AppError(isEN ? "You cannot register as admin." : "Vous ne pouvez pas vous inscrire en tant qu'administrateur.", 403));
      }
      assignedRole = role || Role.MEMBER;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { verificationCode, verificationCodeExpiresAt } = generateVerificationCode(24 * 60 * 60 * 1000);
    const avatarSvg = await generateAvatar(`${firstName} ${lastName}`);
    const profileImageUrl = await uploadToCloudinary(avatarSvg, true);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        profileImage: {
          create: {
            url: profileImageUrl.secure_url,
            publicId: profileImageUrl.public_id,
            type: AssetType.IMAGE,
            category: AssetCategory.PROFILE_IMAGE,
          },
        },
        verificationCode: Number(verificationCode),
        verificationCodeExpiresAt,
        role: assignedRole,
        currentRefreshTokenVersion: 0,
        language: isEN ? Language.EN : Language.FR,
        status: "NEW",
      },
      include: {
        profileImage: true,
      },
    });

    await sendVerificationEmail(email, verificationCode.toString(), isEN ? Language.EN : Language.FR, "signup");

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id, 0);

    res.status(201).json({
      success: true,
      message: isEN
        ? "Registration successful. Please check your email for verification."
        : "Inscription réussie. Veuillez vérifier votre courriel pour vérification.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language,
        avatarUrl: user.avatarUrl || user.profileImage?.url,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        is2FAEnabled: user.is2FAEnabled,
        phoneVerified: user.phoneVerified,
      },
    });
  });

  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(AppError("Please provide email and password.", 400));
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { profileImage: true } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await prisma.loginActivity.create({
        data: {
          userId: user?.id || "anonymous",
          ip: req.ip || "unknown",
          userAgent: req.get("User-Agent") || "unknown",
          success: false,
        },
      });
      return next(AppError("Incorrect email or password.", 401));
    }

    if (user.isDeleted) return next(AppError("Account deactivated.", 401));
    if (!user.isEmailVerified) return next(AppError("Please verify your email first.", 403));

    if (
      (user.role === "ADMIN" || user.role === "PASTOR") &&
      (!user.is2FAEnabled || !user.phoneVerified)
    ) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await sendVerificationEmail(
        user.email,
        code,
        user.language,
        "login"
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode: parseInt(code),
          verificationCodeExpiresAt: expiresAt,
        },
      });

      return res.status(403).json({
        success: false,
        message: "2FA required. Verification code sent to your email.",
        require2FA: true,
      });
    }

    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        ip: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        success: true,
      },
    });

    if (!user.lastLogin) {
      await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, user.language);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = generateToken(user.id);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language,
        avatarUrl: user.avatarUrl || user.profileImage?.url,
        is2FAEnabled: user.is2FAEnabled,
        phoneVerified: user.phoneVerified,
      },
    });
  });

  static verify2FA = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;

    if (!email || !code) {
      return next(AppError("Email and verification code are required.", 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profileImage: true },
    });

    if (!user) {
      return next(AppError("User not found.", 404));
    }

    if (!user.verificationCode || !user.verificationCodeExpiresAt) {
      return next(AppError("No 2FA verification pending.", 400));
    }

    if (user.verificationCode !== parseInt(code)) {
      return next(AppError("Invalid verification code.", 400));
    }

    if (new Date() > user.verificationCodeExpiresAt) {
      return next(AppError("Verification code expired. Please log in again.", 400));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        ip: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        success: true,
      },
    });

    if (!user.lastLogin) {
      await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, user.language);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id, user.currentRefreshTokenVersion);

    res.status(200).json({
      success: true,
      message: "2FA verified. Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language,
        avatarUrl: user.avatarUrl || user.profileImage?.url,
        is2FAEnabled: user.is2FAEnabled,
        phoneVerified: user.phoneVerified,
      },
    });
  });

  static refreshAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(AppError("Refresh token required.", 400));

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return next(AppError("Invalid or expired refresh token.", 401));

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.isDeleted || decoded.version !== user.currentRefreshTokenVersion) {
      return next(AppError("Session expired. Please log in again.", 401));
    }

    const newAccessToken = generateToken(user.id);
    res.status(200).json({ success: true, accessToken: newAccessToken });
  });

  static forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.isDeleted) {
      return res.status(200).json({
        success: true,
        message: "If your email is registered, you will receive a reset link.",
      });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.language
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  });

  static resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(AppError("Token and new password are required.", 400));
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
        isDeleted: false,
      },
    });

    if (!user) {
      return next(AppError("Invalid or expired reset token.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await sendPasswordResetConfirmationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      user.language
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  });

  static enable2FA = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) return next(AppError("Phone number required.", 400));

    const existing = await prisma.user.findFirst({
      where: { phone, NOT: { id: req.user!.id } },
    });
    if (existing) return next(AppError("Phone already in use.", 409));

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await SmsService.sendVerificationCodeSMS(
      phone,
      code,
      req.user!.language
    );

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        phone,
        verificationCode: parseInt(code),
        verificationCodeExpiresAt: expiresAt,
      },
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent. Enter it to enable 2FA.",
    });
  });

  static verify2FACode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) {
      return next(AppError("No pending verification.", 400));
    }

    if (user.verificationCode !== parseInt(code)) {
      return next(AppError("Invalid code.", 400));
    }

    if (new Date() > user.verificationCodeExpiresAt) {
      return next(AppError("Code expired. Request a new one.", 400));
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        is2FAEnabled: true,
        phoneVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    res.status(200).json({ success: true, message: "2FA enabled successfully." });
  });

  static sendVerificationSMS = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) return next(AppError("Phone number required.", 400));

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await SmsService.sendVerificationCodeSMS(
      phone,
      code,
      req.user!.language
    );

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        phone,
        verificationCode: parseInt(code),
        verificationCodeExpiresAt: expiresAt,
      },
    });

    res.status(200).json({ success: true, message: "Verification code sent via SMS." });
  });

  static verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) {
      return next(AppError("No pending email verification.", 400));
    }

    if (user.verificationCode !== parseInt(code)) {
      return next(AppError("Invalid verification code.", 400));
    }

    if (new Date() > user.verificationCodeExpiresAt) {
      return next(AppError("Verification code expired. Request a new one.", 400));
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    await sendWelcomeEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      user.language
    );

    res.status(200).json({ success: true, message: "Email verified successfully." });
  });

  static verifyPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) {
      return next(AppError("No pending phone verification.", 400));
    }

    if (user.verificationCode !== parseInt(code)) {
      return next(AppError("Invalid verification code.", 400));
    }

    if (new Date() > user.verificationCodeExpiresAt) {
      return next(AppError("Verification code expired. Request a new one.", 400));
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        phoneVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    res.status(200).json({ success: true, message: "Phone number verified successfully." });
  });

  static logout = (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Logged out successfully." });
  };
}
