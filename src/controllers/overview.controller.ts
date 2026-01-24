import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { OverviewService } from "../services/overview.service";

export class OverviewController {
    static getStats = catchAsync(async (req: Request, res: Response) => {
        const stats = await OverviewService.getDashboardStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    });
}
