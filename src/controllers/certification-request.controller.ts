import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { CertificationRequestService } from "../services/certification-request.service";
import { RequestStatus } from "@prisma/client";

export class CertificationRequestController {
    // Marriage Requests
    static createMarriageRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await CertificationRequestService.createMarriageRequest({
            witness1Name: data.witness1Name,
            witness1Phone: data.witness1Phone,
            witness2Name: data.witness2Name,
            witness2Phone: data.witness2Phone,
            weddingDate: new Date(data.weddingDate),
            location: data.location,
            bride: { connect: { id: data.brideId } },
            groom: { connect: { id: data.groomId } },
            requester: { connect: { id: req.user!.id } },
        } as any);
        res.status(201).json({ success: true, data: result });
    });

    static getAllMarriageRequests = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, status, requesterId } = req.query;
        const where: any = {};
        if (status) where.status = status as RequestStatus;
        if (requesterId) where.requesterId = requesterId;

        const { data, total } = await CertificationRequestService.getAllMarriageRequests(
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

    static updateMarriageRequestStatus = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = matchedData(req);
        const result = await CertificationRequestService.updateMarriageRequestStatus(id, status, req.user!.id);
        res.status(200).json({ success: true, data: result });
    });

    // Baptism Requests
    static createBaptismRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await CertificationRequestService.createBaptismRequest({
            childName: data.childName,
            dateOfBirth: new Date(data.dateOfBirth),
            requester: { connect: { id: req.user!.id } },
        } as any);
        res.status(201).json({ success: true, data: result });
    });

    static getAllBaptismRequests = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, status, requesterId } = req.query;
        const where: any = {};
        if (status) where.status = status as RequestStatus;
        if (requesterId) where.requesterId = requesterId;

        const { data, total } = await CertificationRequestService.getAllBaptismRequests(
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

    static updateBaptismRequestStatus = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, scheduledDate } = matchedData(req);
        const result = await CertificationRequestService.updateBaptismRequestStatus(
            id,
            status,
            req.user!.id,
            scheduledDate ? new Date(scheduledDate) : undefined
        );
        res.status(200).json({ success: true, data: result });
    });
}
