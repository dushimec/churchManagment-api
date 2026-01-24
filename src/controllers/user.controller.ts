import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { Role, Language } from "@prisma/client";
import { profileSelects } from "../types";
import { UserService } from "../services/user.service";
import { uploadToCloudinary } from "../utils/cloudinary";
import { generateAvatar } from "../utils/generateAvatar";
import { SmsService } from "../services/sms.service";
import { sendVerificationEmail } from "../config/email";
import bcrypt from "bcryptjs";

export class UserController {

  static getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getUserByUnique(
      { id: req.user!.id },
      profileSelects
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  });

  static getUser = catchAsync(async (req: Request, res: Response, next) => {
    const user = await UserService.getUserByUnique(
      { id: req.params.id },
      profileSelects
    );

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  });

  static createUser = catchAsync(async (req: Request, res: Response, next) => {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (firstName, lastName, email, password).",
      });
    }

    const existingUser = await UserService.getUserByUnique({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
    }

    if (phone) {
      const existingPhone = await UserService.getUserByUnique({ phone });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already in use.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarSvg = await generateAvatar(`${firstName} ${lastName}`);
    const profileImageUrl = await uploadToCloudinary(avatarSvg, true);

    const user = await UserService.createUser({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || Role.MEMBER,
      status: "ACTIVE", // Admin created users are active by default
      isEmailVerified: true, // Admin created users are verified
      profileImage: {
        create: {
          url: profileImageUrl.secure_url,
          publicId: profileImageUrl.public_id,
          type: "IMAGE",
          category: "PROFILE_IMAGE"
        }
      }
    });

    res.status(201).json({
      success: true,
      user,
      message: "User created successfully."
    });
  });

  static getUsers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const { role, search } = req.query;

    // Handle search
    if (search) {
      const result = await UserService.searchUsers(search as string, page, pageSize);
      return res.status(200).json({
        success: true,
        users: result.users,
        pagination: {
          page,
          pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / pageSize),
        },
      });
    }

    // Handle role filter
    const where: any = { isDeleted: false };

    if (role) {
      const userRole = (role as string).toUpperCase() as Role;
      if (Object.values(Role).includes(userRole)) {
        where.role = userRole;
      }
    }

    const sortBy = (req.query.sortBy as string) || "firstName";
    const orderDir = (req.query.order as "asc" | "desc") || "asc";
    const orderBy = { [sortBy]: orderDir };

    const { users, total } = await UserService.getAllUsers(
      page,
      pageSize,
      where,
      profileSelects,
      orderBy
    );

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  });


  static updateUser = catchAsync(async (req: Request, res: Response, next) => {

    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { firstName, lastName, email, phone, language } = req.body;
    const updates: any = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (language && Object.values(Language).includes(language as Language)) {
      updates.language = language;
    }

    if (email) {
      const existing = await UserService.getUser({
        email,
        NOT: { id: req.params.id },
        isDeleted: false,
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (phone) {
      const existing = await UserService.getUser({
        phone,
        NOT: { id: req.params.id },
        isDeleted: false,
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Phone already in use",
        });
      }
    }

    const user = await UserService.updateUser(req.params.id, updates, profileSelects);

    res.status(200).json({
      success: true,
      user,
    });
  });

  static uploadAvatar = catchAsync(async (req: Request, res: Response, next) => {

    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar data required",
      });
    }

    let imageUrl: string;
    let publicId: string;

    if (typeof avatar === "string" && avatar.startsWith("image")) {
      const result = await uploadToCloudinary(avatar, true);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else if (typeof avatar === "string") {
      const svg = await generateAvatar(avatar);
      const result = await uploadToCloudinary(svg, true);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid avatar format",
      });
    }

    const user = await UserService.updateProfileImage(req.params.id, imageUrl, publicId);

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatarUrl: user.avatarUrl,
      profileImage: user.profileImage,
    });
  });

  static resendVerificationCode = catchAsync(async (req: Request, res: Response, next) => {

    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await UserService.getUserByUnique({ id: req.params.id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sendVerificationEmail(user.email, code, user.language, "login");

    if (user.phone) {
      await SmsService.sendVerificationCodeSMS(user.phone, code, user.language);
    }

    await UserService.updateUser(user.id, {
      verificationCode: parseInt(code),
      verificationCodeExpiresAt: expiresAt,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email and phone (if available).",
    });
  });

  static updateUserRole = catchAsync(async (req: Request, res: Response, next) => {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { role } = req.body;
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await UserService.updateUserRole(req.params.id, role);

    res.status(200).json({
      success: true,
      user,
    });
  });


  static softDeleteUser = catchAsync(async (req: Request, res: Response, next) => {

    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await UserService.getUserByUnique({ id: req.params.id });
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await UserService.updateUser(req.params.id, { isDeleted: true });

    res.status(200).json({
      success: true,
      message: "User account soft deleted.",
    });
  });
}