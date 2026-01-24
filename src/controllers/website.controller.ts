import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { WebsiteService } from "../services/website.service";
import { uploadToCloudinary } from "../utils/cloudinary";

export class WebsiteController {
    static getAboutSections = catchAsync(async (req: Request, res: Response) => {
        const sections = await WebsiteService.getAboutSections();
        res.status(200).json({ success: true, data: sections });
    });

    static upsertAboutSection = catchAsync(async (req: Request, res: Response) => {
        const { type, title, content } = req.body;
        const section = await WebsiteService.upsertAboutSection(type, title, content);
        res.status(200).json({ success: true, data: section });
    });

    static getLeadership = catchAsync(async (req: Request, res: Response) => {
        const members = await WebsiteService.getLeadership();
        res.status(200).json({ success: true, data: members });
    });

    static addLeadership = catchAsync(async (req: Request, res: Response) => {
        const data = { ...req.body };
        if (data.file) {
            const uploadResult = await uploadToCloudinary(data.file, false);
            data.imageUrl = uploadResult.secure_url;
            delete data.file;
        }
        const member = await WebsiteService.addLeadership(data);
        res.status(201).json({ success: true, data: member });
    });

    static updateLeadership = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = { ...req.body };
        if (data.file) {
            const uploadResult = await uploadToCloudinary(data.file, false);
            data.imageUrl = uploadResult.secure_url;
            delete data.file;
        }
        const member = await WebsiteService.updateLeadership(id, data);
        res.status(200).json({ success: true, data: member });
    });

    static deleteLeadership = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await WebsiteService.deleteLeadership(id);
        res.status(200).json({ success: true, message: "Member deleted successfully" });
    });

    static getContactInfo = catchAsync(async (req: Request, res: Response) => {
        const info = await WebsiteService.getContactInfo();
        res.status(200).json({ success: true, data: info });
    });

    static upsertContactInfo = catchAsync(async (req: Request, res: Response) => {
        const info = await WebsiteService.upsertContactInfo(req.body);
        res.status(200).json({ success: true, data: info });
    });
}
