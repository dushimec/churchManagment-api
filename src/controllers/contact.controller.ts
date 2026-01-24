import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { ContactService } from "../services/contact.service";

export class ContactController {
    static createMessage = catchAsync(async (req: Request, res: Response) => {
        const message = await ContactService.createMessage(req.body);
        res.status(201).json({ success: true, data: message });
    });

    static getAllMessages = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await ContactService.getAllMessages(Number(page), Number(limit));
        res.status(200).json({
            success: true,
            data,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    });

    static markAsRead = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const message = await ContactService.markAsRead(id);
        res.status(200).json({ success: true, data: message });
    });

    static deleteMessage = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await ContactService.deleteMessage(id);
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    });
}
