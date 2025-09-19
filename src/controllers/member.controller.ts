import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import type { Prisma } from "@prisma/client";

const removeUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export class MemberController {

  static createMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      names,
      email,
      phoneNumber,
      idNumber,
      district,
      sector,
      cell,
      churchCell,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      occupation,
      address,
      baptismDate,
      confirmationDate,
      spiritualMaturity,
      ministryPreferences,
    } = matchedData(req, { includeOptionals: true });

    const isEN = req.isEnglishPreferred || true;

    const parseDate = (dateStr?: string): Date | undefined => {
      if (!dateStr) return undefined;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        throw new Error(isEN ? "Invalid date format." : "Format de date invalide.");
      }
      if (d > new Date()) {
        throw new Error(
          isEN
            ? "Date cannot be in the future."
            : "La date ne peut pas être dans le futur."
        );
      }
      return d;
    };

    try {
      const data: Prisma.MemberCreateInput = {
        names,
        email,
        phoneNumber,
        idNumber,
        district,
        sector,
        cell,
        churchCell,
        dateOfBirth: parseDate(dateOfBirth),
        gender,
        maritalStatus,
        nationality,
        occupation,
        address,
        baptismDate: parseDate(baptismDate),
        confirmationDate: parseDate(confirmationDate),
        spiritualMaturity,
        ministryPreferences: ministryPreferences || [],
        dateJoined: new Date(),
      };

      Object.keys(data).forEach(
        (key) => data[key as keyof typeof data] === undefined && delete data[key as keyof typeof data]
      );

      const member = await prisma.member.create({ data });

      res.status(201).json({
        success: true,
        message: isEN ? "Member created successfully." : "Membre créé avec succès.",
        data: member,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  });

  static getAllMembers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    };

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { names: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { idNumber: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
        { cell: { contains: search, mode: "insensitive" } },
        { churchCell: { contains: search, mode: "insensitive" } },
        { gender: { contains: search, mode: "insensitive" } },
        { maritalStatus: { contains: search, mode: "insensitive" } },
        { nationality: { contains: search, mode: "insensitive" } },
        { occupation: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { spiritualMaturity: { contains: search, mode: "insensitive" } },
      ];
    }

    const allowedSortFields = [
      "names", "email", "phoneNumber", "idNumber", "district", "sector", "cell", "churchCell",
      "dateOfBirth", "gender", "maritalStatus", "nationality", "occupation", "address",
      "baptismDate", "confirmationDate", "spiritualMaturity", "createdAt", "dateJoined"
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order: "asc" | "desc" = sortOrder === "asc" ? "asc" : "desc";

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { [sortField]: order },
      }),
      prisma.member.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  });

  static getMemberById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  });

  static updateMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const {
      names,
      email,
      phoneNumber,
      idNumber,
      district,
      sector,
      cell,
      churchCell,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      occupation,
      address,
      baptismDate,
      confirmationDate,
      spiritualMaturity,
      ministryPreferences,
    } = matchedData(req);

    const isEN = req.isEnglishPreferred || true;

    const parseDate = (dateStr?: string): Date | undefined => {
        if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error(isEN ? "Invalid date format." : "Format de date invalide.");
  }
  if (d > new Date()) {
    throw new Error(
      isEN
        ? "Date cannot be in the future."
        : "La date ne peut pas être dans le futur."
    );
  }
      return d;
    };

    const data = removeUndefined({
      names,
      email,
      phoneNumber,
      idNumber,
      district,
      sector,
      cell,
      churchCell,
      dateOfBirth: parseDate(dateOfBirth),
      gender,
      maritalStatus,
      nationality,
      occupation,
      address,
      baptismDate: parseDate(baptismDate),
      confirmationDate: parseDate(confirmationDate),
      spiritualMaturity,
      ministryPreferences,
    });

    let member;
    try {
      member = await prisma.member.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: isEN ? "Member not found." : "Membre non trouvé.",
      });
    }

    res.status(200).json({
      success: true,
      message: isEN ? "Member updated successfully." : "Membre mis à jour avec succès.",
      data: member,
    });
  });

    static deleteMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await prisma.member.delete({
        where: { id },
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
    });
  });
}