import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/CatchAsync";
import { User, Role } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";


const JWT_SECRET = process.env.JWT_SECRET!;

export const verifyAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Authorization header:", req.headers.authorization);
    let isEN = req.isEnglishPreferred;
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: isEN ? "You are not logged in. Please log in to get access." : "Vous n'êtes pas connecté. Veuillez vous connecter pour obtenir l'accès."
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message: isEN ? "Invalid token. Please log in again." : "Jeton invalide. Veuillez vous reconnecter."
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        phone: true,
        profileImageId: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        language: true,
        avatarUrl: true,
        isVerified: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        verificationToken: true,
        verificationCode: true,
        verificationCodeExpiresAt: true,
        resetToken: true,
        resetTokenExpiry: true,
        currentRefreshTokenVersion: true,
        lastLogin: true,
        isEmailVerified: true,
        status: true,
        is2FAEnabled: true,
        phoneVerified: true,
      },
    });

    

    if (!currentUser || currentUser.isDeleted) {
      return res.status(401).json({
        success: false,
        message: isEN ? "The user belonging to this token no longer exists." : "El usuario que pertenece a este token ya no existe."
      });
    }


    req.user = currentUser;
    req.isEnglishPreferred = isEN

    next();
  }
);

export const protectOptional = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.user = null;
      req.isEnglishPreferred = req.headers["accept-language"]?.startsWith("en") || true;
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!currentUser || currentUser.isDeleted) {
        req.user = null;
      } else {
        req.user = currentUser;
        req.isEnglishPreferred = currentUser.language === "EN";
      }
    } catch {
      req.user = null;
    }

    req.isEnglishPreferred = req.isEnglishPreferred || true;
    next();
  }
);

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
};

export const restrictToMemberOrSelf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(AppError("Authentication required.", 401));

    if (req.user.role === "ADMIN" || req.user.role === "PASTOR") return next();

    const requestedId = req.params.id;
    const member = await prisma.member.findFirst({
      where: { id: req.user.id },
    });

    if (!member || member.id !== requestedId) {
      return next(AppError("You cannot access this resource.", 403));
    }

    next();
  }
);