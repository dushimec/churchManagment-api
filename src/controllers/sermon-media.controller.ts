import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { SermonMediaService } from "../services/sermon-media.service";
import { AssetType } from "@prisma/client";

export class SermonMediaController {
    // Sermons
    static createSermon = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await SermonMediaService.createSermon({
            title: data.title,
            theme: data.theme,
            scripture: data.scripture,
            audioUrl: data.audioUrl,
            videoUrl: data.videoUrl,
            text: data.text,
            tags: data.tags,
            preacher: { connect: { id: data.preacherId } },
            service: data.serviceId ? { connect: { id: data.serviceId } } : undefined,
        } as any);
        res.status(201).json({ success: true, data: result });
    });

    static getAllSermons = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, preacherId, serviceId, theme } = req.query;
        const where: any = {};
        if (preacherId) where.preacherId = preacherId;
        if (serviceId) where.serviceId = serviceId;
        if (theme) where.theme = { contains: theme as string, mode: "insensitive" };

        const { data, total } = await SermonMediaService.getAllSermons(
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

    static getSermonById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SermonMediaService.getSermonById(id);
        if (!result) return res.status(404).json({ success: false, message: "Sermon not found" });
        res.status(200).json({ success: true, data: result });
    });

    static updateSermon = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = matchedData(req);
        const result = await SermonMediaService.updateSermon(id, data);
        res.status(200).json({ success: true, data: result });
    });

    static deleteSermon = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await SermonMediaService.deleteSermon(id);
        res.status(200).json({ success: true, message: "Sermon deleted successfully" });
    });

    // Media
    static createMedia = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await SermonMediaService.createMedia({
            url: data.url,
            type: data.type,
            title: data.title,
            sermon: data.sermonId ? { connect: { id: data.sermonId } } : undefined,
            user: data.userId ? { connect: { id: data.userId } } : undefined,
        } as any);
        res.status(201).json({ success: true, data: result });
    });

    static getAllMedia = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, type, sermonId } = req.query;
        const where: any = {};
        if (type) where.type = type as AssetType;
        if (sermonId) where.sermonId = sermonId;

        const { data, total } = await SermonMediaService.getAllMedia(
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

    static deleteMedia = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await SermonMediaService.deleteMedia(id);
        res.status(200).json({ success: true, message: "Media deleted successfully" });
    });
}
