import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import type { Prisma } from "@prisma/client";
import { MemberService } from "../services/member.service";

const removeUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export class MemberController {

  private static parseDate = (dateStr?: string, isEN: boolean = true): Date | undefined => {
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

  static createMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = matchedData(req, { includeOptionals: true });
    const isEN = req.isEnglishPreferred || true;

    try {
      const memberData: Prisma.MemberCreateInput = {
        ...data,
        dateOfBirth: this.parseDate(data.dateOfBirth, isEN),
        baptismDate: this.parseDate(data.baptismDate, isEN),
        confirmationDate: this.parseDate(data.confirmationDate, isEN),
        dateJoined: new Date(),
        ministryPreferences: data.ministryPreferences || [],
        names: ""
      };

      const cleanedData = removeUndefined(memberData);
      const member = await MemberService.createMember(cleanedData as Prisma.MemberCreateInput);

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

    const whereClause: Prisma.MemberWhereInput = {};
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

    const { data: members, total } = await MemberService.getAllMembers(
      Number(page),
      Number(limit),
      whereClause,
      { [sortField]: order }
    );

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
    const member = await MemberService.getMemberById(id);

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
    const data = matchedData(req);
    const isEN = req.isEnglishPreferred || true;

    try {
      const updateData = removeUndefined({
        ...data,
        dateOfBirth: this.parseDate(data.dateOfBirth, isEN),
        baptismDate: this.parseDate(data.baptismDate, isEN),
        confirmationDate: this.parseDate(data.confirmationDate, isEN),
      });

      const member = await MemberService.updateMember(id, updateData);

      res.status(200).json({
        success: true,
        message: isEN ? "Member updated successfully." : "Membre mis à jour avec succès.",
        data: member,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: isEN ? "Member not found." : "Membre non trouvé.",
      });
    }
  });

  static deleteMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await MemberService.deleteMember(id);
      res.status(200).json({
        success: true,
        message: "Member deleted successfully.",
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }
  });
}