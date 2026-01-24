import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { CertificationRequestService } from "../services/certification-request.service";
import { RequestStatus } from "@prisma/client";
import { prisma } from "../config/database";

export class CertificationRequestController {
    // Marriage Requests
    static createMarriageRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;

        const createInput: any = {
            witness1Name: data.witness1Name,
            witness1Phone: data.witness1Phone,
            witness2Name: data.witness2Name,
            witness2Phone: data.witness2Phone,
            weddingDate: new Date(data.weddingDate),
            location: data.location,
            brideName: data.brideName,
            bridePhone: data.bridePhone,
            brideEmail: data.brideEmail,
            brideNationalId: data.brideNationalId, // Added
            groomName: data.groomName,
            groomPhone: data.groomPhone,
            groomEmail: data.groomEmail,
            groomNationalId: data.groomNationalId, // Added
            requesterName: data.requesterName,
            requesterPhone: data.requesterPhone,
            requesterEmail: data.requesterEmail,
            requesterNationalId: data.requesterNationalId, // Added
        };

        if (data.brideId && data.brideId.trim() !== "") {
            const brideExists = await prisma.user.findUnique({ where: { id: data.brideId } });
            if (!brideExists) {
                return res.status(400).json({ success: false, message: "Invalid Bride ID. User not found." });
            }
            createInput.bride = { connect: { id: data.brideId } };
        }

        if (data.groomId && data.groomId.trim() !== "") {
            const groomExists = await prisma.user.findUnique({ where: { id: data.groomId } });
            if (!groomExists) {
                return res.status(400).json({ success: false, message: "Invalid Groom ID. User not found." });
            }
            createInput.groom = { connect: { id: data.groomId } };
        }

        if (req.user) {
            createInput.requester = { connect: { id: req.user.id } };
        }

        console.log("Creating Marriage Request with input:", JSON.stringify(createInput, null, 2));

        try {
            const result = await CertificationRequestService.createMarriageRequest(createInput);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error("Error creating marriage request:", error);
            throw error;
        }
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

        const createInput: any = {
            childName: data.childName,
            dateOfBirth: new Date(data.dateOfBirth),
            requesterName: data.requesterName,
            requesterPhone: data.requesterPhone,
            requesterEmail: data.requesterEmail,
            requesterNationalId: data.requesterNationalId, // Added
        };

        if (req.user) {
            createInput.requester = { connect: { id: req.user.id } };
        } else if (data.requesterId && data.requesterId.trim() !== "") {
            const requesterExists = await prisma.user.findUnique({ where: { id: data.requesterId } });
            if (!requesterExists) {
                return res.status(400).json({ success: false, message: "Invalid Requester ID. User not found." });
            }
            createInput.requester = { connect: { id: data.requesterId } };
        }

        const result = await CertificationRequestService.createBaptismRequest(createInput);
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
