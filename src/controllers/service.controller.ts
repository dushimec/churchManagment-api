import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { ServiceService } from "../services/service.service";

export class ServiceController {
    // --- Service Management ---

    static createService = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);

        // Convert string dates to Date objects
        if (data.date) data.date = new Date(data.date);
        if (data.startTime) data.startTime = new Date(data.startTime);
        if (data.endTime) data.endTime = new Date(data.endTime);

        const service = await ServiceService.createService(data as any);

        res.status(201).json({
            success: true,
            data: service,
        });
    });

    static getAllServices = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, type } = req.query;

        const where: any = {};
        if (type) where.serviceType = type;

        const { data, total } = await ServiceService.getAllServices(
            Number(page),
            Number(limit),
            where,
            {
                preacher: { select: { firstName: true, lastName: true } },
                choirLeader: { select: { firstName: true, lastName: true } },
            },
            { date: "desc" }
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

    static getServiceById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const service = await ServiceService.getServiceById(id, {
            preacher: { select: { firstName: true, lastName: true } },
            choirLeader: { select: { firstName: true, lastName: true } },
            _count: { select: { attendance: true } },
        });

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.status(200).json({ success: true, data: service });
    });

    static updateService = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = matchedData(req);

        if (data.date) data.date = new Date(data.date);
        if (data.startTime) data.startTime = new Date(data.startTime);
        if (data.endTime) data.endTime = new Date(data.endTime);

        const service = await ServiceService.updateService(id, data as any);

        res.status(200).json({ success: true, data: service });
    });

    static deleteService = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await ServiceService.deleteService(id);
        res.status(200).json({ success: true, message: "Service deleted successfully" });
    });

    // --- Attendance Management ---

    static markAttendance = catchAsync(async (req: Request, res: Response) => {
        const { serviceId, memberId, method = "manual" } = matchedData(req);

        const attendance = await ServiceService.markAttendance(serviceId, memberId, method);

        res.status(201).json({ success: true, data: attendance });
    });

    static getServiceAttendance = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const { data, total } = await ServiceService.getServiceAttendance(
            id,
            Number(page),
            Number(limit),
            {
                member: { select: { firstName: true, lastName: true, email: true } },
            }
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
}
