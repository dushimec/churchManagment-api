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
            brideEmail: data.brideEmail,
            groomEmail: data.groomEmail,
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
        const { status, reason } = matchedData(req);
        const result = await CertificationRequestService.updateMarriageRequestStatus(id, status, req.user!.id, reason);
        res.status(200).json({ success: true, data: result, message: `Request ${status.toLowerCase()} successfully. Email notification sent.` });
    });

    // Baptism Requests
    static createBaptismRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await CertificationRequestService.createBaptismRequest({
            childName: data.childName,
            dateOfBirth: new Date(data.dateOfBirth),
            requesterEmail: data.requesterEmail,
            requester: { connect: { id: req.user!.id || data.requesterId } },
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
        const { status, scheduledDate, reason } = matchedData(req);
        const result = await CertificationRequestService.updateBaptismRequestStatus(
            id,
            status,
            req.user!.id,
            scheduledDate ? new Date(scheduledDate) : undefined,
            reason
        );
        res.status(200).json({ success: true, data: result, message: `Request ${status.toLowerCase()} successfully. Email notification sent.` });
    });

    // Convenience methods for confirm/reject
    static confirmMarriageRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await CertificationRequestService.updateMarriageRequestStatus(id, RequestStatus.APPROVED, req.user!.id);
        res.status(200).json({ success: true, data: result, message: 'Marriage request confirmed successfully. Email notification sent.' });
    });

    static rejectMarriageRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reason } = req.body;
        const result = await CertificationRequestService.updateMarriageRequestStatus(id, RequestStatus.REJECTED, req.user!.id, reason);
        res.status(200).json({ success: true, data: result, message: 'Marriage request rejected successfully. Email notification sent.' });
    });

    static confirmBaptismRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await CertificationRequestService.updateBaptismRequestStatus(id, RequestStatus.APPROVED, req.user!.id);
        res.status(200).json({ success: true, data: result, message: 'Baptism request confirmed successfully. Email notification sent.' });
    });

    static rejectBaptismRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reason } = req.body;
        const result = await CertificationRequestService.updateBaptismRequestStatus(id, RequestStatus.REJECTED, req.user!.id, undefined, reason);
        res.status(200).json({ success: true, data: result, message: 'Baptism request rejected successfully. Email notification sent.' });
    });
}
