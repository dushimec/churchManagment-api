import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { CommunicationService } from "../services/communication.service";

export class CommunicationController {
    // Notifications
    static getMyNotifications = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, unreadOnly } = req.query;
        const { data, total } = await CommunicationService.getNotificationsForUser(
            req.user!.id,
            Number(page),
            Number(limit),
            unreadOnly === "true"
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

    static markAsRead = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await CommunicationService.markNotificationAsRead(id);
        res.status(200).json({ success: true, data: result });
    });

    static markAllAsRead = catchAsync(async (req: Request, res: Response) => {
        await CommunicationService.markAllNotificationsAsRead(req.user!.id);
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    });

    // Messages
    static sendMessage = catchAsync(async (req: Request, res: Response) => {
        const { receiverId, content } = matchedData(req);
        const result = await CommunicationService.sendMessage({
            content,
            sender: { connect: { id: req.user!.id } },
            receiver: { connect: { id: receiverId } },
        });
        res.status(201).json({ success: true, data: result });
    });

    static getChatHistory = catchAsync(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const { data, total } = await CommunicationService.getChatHistory(
            req.user!.id,
            userId,
            Number(page),
            Number(limit)
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
