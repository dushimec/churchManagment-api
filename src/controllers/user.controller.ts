// src/controllers/user.controller.ts

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { AppError } from "../utils/AppError";
import { Role, Language } from "@prisma/client";
import { profileSelects } from "../types";
import { UserService } from "../services/user.service";
import { uploadToCloudinary } from "../utils/cloudinary";
import { generateAvatar } from "../utils/generateAvatar";
import { SmsService } from "../services/sms.service";
import { sendVerificationEmail } from "../config/email";

export class UserController {
  /**
   * @desc    Get current user
   * @route   GET /api/v1/users/me
   * @access  Private
   */
  static getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getUserByUnique(
      { id: req.user!.id },
      profileSelects
    );

    if (!user) return next(AppError("User not found", 404));

    res.status(200).json({
      success: true,
      user,
    });
  });

  /**
   * @desc    Get user by ID
   * @route   GET /api/v1/users/:id
   * @access  Private
   */
  static getUser = catchAsync(async (req: Request, res: Response, next) => {
    const user = await UserService.getUserByUnique(
      { id: req.params.id },
      profileSelects
    );

    if (!user || user.isDeleted) {
      return next(AppError("Account not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  });

  /**
   * @desc    Get all users (paginated, filtered, sorted)
   * @route   GET /api/v1/users
   * @access  Private
   */
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

    // Build orderBy
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

  /**
   * @desc    Update user profile
   * @route   PATCH /api/v1/users/:id
   * @access  Private (self or admin)
   */
  static updateUser = catchAsync(async (req: Request, res: Response, next) => {
    // Allow self or admin
    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return next(AppError("Access denied", 403));
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

    // Prevent email/phone conflict
    if (email) {
      const existing = await UserService.getUser({
        email,
        NOT: { id: req.params.id },
        isDeleted: false,
      });
      if (existing) return next(AppError("Email already in use", 409));
    }

    if (phone) {
      const existing = await UserService.getUser({
        phone,
        NOT: { id: req.params.id },
        isDeleted: false,
      });
      if (existing) return next(AppError("Phone already in use", 409));
    }

    const user = await UserService.updateUser(req.params.id, updates, profileSelects);

    res.status(200).json({
      success: true,
      user,
    });
  });

  /**
   * @desc    Upload/change avatar
   * @route   POST /api/v1/users/:id/avatar
   * @access  Private (self or admin)
   */
  static uploadAvatar = catchAsync(async (req: Request, res: Response, next) => {
    // Allow self or admin
    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return next(AppError("Access denied", 403));
    }

    const { avatar } = req.body;

    if (!avatar) {
      return next(AppError("Avatar data required", 400));
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
      return next(AppError("Invalid avatar format", 400));
    }

    const user = await UserService.updateProfileImage(req.params.id, imageUrl, publicId);

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatarUrl: user.avatarUrl,
      profileImage: user.profileImage,
    });
  });

  /**
   * @desc    Resend verification code (email + optional SMS)
   * @route   POST /api/v1/users/:id/resend-code
   * @access  Private (self or admin)
   */
  static resendVerificationCode = catchAsync(async (req: Request, res: Response, next) => {
    // Allow self or admin
    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return next(AppError("Access denied", 403));
    }

    const user = await UserService.getUserByUnique({ id: req.params.id });
    if (!user) return next(AppError("User not found", 404));

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ Send via email
    await sendVerificationEmail(user.email, code, user.language, "login");

    // ✅ Send via SMS if phone exists
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

  /**
   * @desc    Update user role (admin only)
   * @route   PATCH /api/v1/users/:id/role
   * @access  Admin only
   */
  static updateUserRole = catchAsync(async (req: Request, res: Response, next) => {
    if (req.user!.role !== "ADMIN") {
      return next(AppError("Access denied", 403));
    }

    const { role } = req.body;
    if (!role || !Object.values(Role).includes(role)) {
      return next(AppError("Invalid role", 400));
    }

    const user = await UserService.updateUserRole(req.params.id, role);

    res.status(200).json({
      success: true,
      user,
    });
  });

  /**
   * @desc    Soft delete user (admin or self)
   * @route   PATCH /api/v1/users/:id/delete
   * @access  Private (admin or self)
   */
  static softDeleteUser = catchAsync(async (req: Request, res: Response, next) => {
    // Allow self or admin
    if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
      return next(AppError("Access denied", 403));
    }

    const user = await UserService.getUserByUnique({ id: req.params.id });
    if (!user || user.isDeleted) {
      return next(AppError("User not found", 404));
    }

    await UserService.updateUser(req.params.id, { isDeleted: true });

    res.status(200).json({
      success: true,
      message: "User account soft deleted.",
    });
  });
}