import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/CatchAsync";
import {
  Prisma,
  Language,
  User,
  Role,
  AssetType,
  AssetCategory,
} from "@prisma/client";
import { generateVerificationCode } from "../utils/generateVerificatinCode";
import { matchedData } from "express-validator";
import { generateAvatar } from "../utils/generateAvatar";
import { uploadToCloudinary } from "../utils/cloudinary";

export class AuthController {
  static register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { firstName, lastName, email, phone, password, role } =
        matchedData<{
          firstName: string;
          lastName: string;
          email: string;
          phone?: string;
          password: string;
          role?: Role;
        }>(req);

      const isEN = req.isEnglishPreferred;

      let message = "";
      const emailExists = await prisma.user.findFirst({ where: { email } });
      if (emailExists) {
        if (emailExists.isDeleted) {
          const hashedPassword = await bcrypt.hash(password, 12);
          const { verificationCode, verificationCodeExpiresAt } =
            generateVerificationCode(24 * 60 * 60 * 1000);

          await prisma.user.update({
            where: { id: emailExists.id },
            data: {
              firstName,
              lastName,
              email,
              phone,
              password: hashedPassword,
              verificationCode: Number(verificationCode),
              verificationCodeExpiresAt,
              isDeleted: false,
              role: Role.MEMBER,
              isEmailVerified: false,
              isVerified: false,
            },
          });

          return res.status(201).json({
            success: true,
            message: isEN
              ? "Registration successful. Please check your email for verification."
              : "Inscription réussie. Veuillez vérifier votre courriel pour vérification.",
          });
        }
        message = isEN
          ? "Account with this email already exist."
          : "Un compte avec ce courriel existe déjà.";
        return next(AppError(message, 409));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { verificationCode, verificationCodeExpiresAt } =
        generateVerificationCode(24 * 60 * 60 * 1000);

      const avatarSvg = await generateAvatar(`${firstName} ${lastName}`);
      const profileImageUrl = await uploadToCloudinary(avatarSvg, true);

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
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
        },
      });

	  return res.status(201).json({
        success: true,
        message: isEN
          ? "Registration successful. Please check your email for verification."
          : "Inscription réussie. Veuillez vérifier votre courriel pour vérification.",
      });

    }
  );
}
