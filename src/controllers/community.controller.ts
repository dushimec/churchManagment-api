import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { CommunityService } from "../services/community.service";
import { EventType } from "@prisma/client";

export class CommunityController {
    // Events
    static createEvent = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await CommunityService.createEvent({
            ...data,
            date: new Date(data.date),
            organizer: { connect: { id: req.user!.id } },
        });
        res.status(201).json({ success: true, data: result });
    });

    static getAllEvents = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, type } = req.query;
        const where: any = {};
        if (type) where.eventType = type as EventType;

        const { data, total } = await CommunityService.getAllEvents(
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

    static getEventById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await CommunityService.getEventById(id);
        if (!result) return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, data: result });
    });

    static updateEvent = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = matchedData(req);
        if (data.date) data.date = new Date(data.date);
        const result = await CommunityService.updateEvent(id, data);
        res.status(200).json({ success: true, data: result });
    });

    static deleteEvent = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await CommunityService.deleteEvent(id);
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    });

    // Event Registrations
    static registerForEvent = catchAsync(async (req: Request, res: Response) => {
        const { id: eventId } = req.params;
        const result = await CommunityService.registerForEvent(eventId, req.user!.id);
        res.status(201).json({ success: true, data: result });
    });

    static unregisterFromEvent = catchAsync(async (req: Request, res: Response) => {
        const { id: eventId } = req.params;
        await CommunityService.unregisterFromEvent(eventId, req.user!.id);
        res.status(200).json({ success: true, message: "Unregistered from event successfully" });
    });

    static getEventRegistrations = catchAsync(async (req: Request, res: Response) => {
        const { id: eventId } = req.params;
        const result = await CommunityService.getEventRegistrations(eventId);
        res.status(200).json({ success: true, data: result });
    });
}
