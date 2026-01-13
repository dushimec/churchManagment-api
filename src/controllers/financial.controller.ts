import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { FinancialService } from "../services/financial.service";
import { ContributionType, PaymentMethod } from "@prisma/client";

export class FinancialController {
    static createContribution = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req) as any;
        const result = await FinancialService.createContribution({
            amount: data.amount,
            contributionType: data.contributionType,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            notes: data.notes,
            receiptUrl: data.receiptUrl,
            member: { connect: { id: req.user!.id } },
        } as any);
        res.status(201).json({ success: true, data: result });
    });

    static getAllContributions = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10, memberId, type, paymentMethod, verified } = req.query;
        const where: any = {};
        if (memberId) where.memberId = memberId;
        if (type) where.contributionType = type as ContributionType;
        if (paymentMethod) where.paymentMethod = paymentMethod as PaymentMethod;
        if (verified !== undefined) where.verified = verified === "true";

        const { data, total } = await FinancialService.getAllContributions(
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

    static getContributionById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await FinancialService.getContributionById(id);
        if (!result) return res.status(404).json({ success: false, message: "Contribution not found" });
        res.status(200).json({ success: true, data: result });
    });

    static verifyContribution = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await FinancialService.verifyContribution(id, req.user!.id);
        res.status(200).json({ success: true, data: result });
    });
}
