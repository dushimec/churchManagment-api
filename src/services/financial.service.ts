import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class FinancialService {
    public static async createContribution(data: Prisma.ContributionCreateInput) {
        return await prisma.contribution.create({ data });
    }

    public static async getAllContributions(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.ContributionWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.contribution.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: "desc" },
                include: {
                    member: { select: { firstName: true, lastName: true, email: true } },
                    verifiedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.contribution.count({ where }),
        ]);
        return { data, total };
    }

    public static async getContributionById(id: string) {
        return await prisma.contribution.findUnique({
            where: { id },
            include: {
                member: { select: { firstName: true, lastName: true, email: true } },
                verifiedBy: { select: { firstName: true, lastName: true } },
            },
        });
    }

    public static async verifyContribution(id: string, verifierId: string) {
        return await prisma.contribution.update({
            where: { id },
            data: {
                verified: true,
                verifiedById: verifierId,
            },
        });
    }
}
