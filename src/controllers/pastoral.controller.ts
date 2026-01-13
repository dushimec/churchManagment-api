import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { PastoralService } from "../services/pastoral.service";
import { RequestStatus } from "@prisma/client";

export class PastoralController {
    // Prayer Requests
    static createPrayerRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await PastoralService.createPrayerRequest({
            ...data,
            member: { connect: { id: req.user!.id } },
        });
        res.status(201).json({ success: true, data: result });
    });

    static getAllPrayerRequests = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, memberId, responded } = req.query;
        const where: any = {};
        if (memberId) where.memberId = memberId;
        if (responded !== undefined) where.responded = responded === "true";

        const { data, total } = await PastoralService.getAllPrayerRequests(
            Number(page),
            Number(limit),
            where
        );

        res.status(200).json({
            success: true,
            data,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    });

    static getPrayerRequestById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await PastoralService.getPrayerRequestById(id);
        if (!result) return res.status(404).json({ success: false, message: "Prayer request not found" });
        res.status(200).json({ success: true, data: result });
    });

    static respondToPrayerRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { response } = matchedData(req);
        const result = await PastoralService.respondToPrayerRequest(id, req.user!.id, response);
        res.status(200).json({ success: true, data: result });
    });

    // Counseling Appointments
    static createCounselingAppointment = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await PastoralService.createCounselingAppointment({
            ...data,
            date: new Date(data.date),
            member: { connect: { id: req.user!.id } },
            pastor: { connect: { id: data.pastorId } },
        });
        res.status(201).json({ success: true, data: result });
    });

    static getAllCounselingAppointments = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, memberId, pastorId, status } = req.query;
        const where: any = {};
        if (memberId) where.memberId = memberId;
        if (pastorId) where.pastorId = pastorId;
        if (status) where.status = status as RequestStatus;

        const { data, total } = await PastoralService.getAllCounselingAppointments(
            Number(page),
            Number(limit),
            where
        );

        res.status(200).json({
            success: true,
            data,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    });

    static updateCounselingStatus = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, notes } = matchedData(req);
        const result = await PastoralService.updateCounselingStatus(id, status, notes);
        res.status(200).json({ success: true, data: result });
    });
}
