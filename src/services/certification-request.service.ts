import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class CertificationRequestService {
    // Marriage Requests
    public static async createMarriageRequest(data: Prisma.MarriageRequestCreateInput) {
        return await prisma.marriageRequest.create({ data });
    }

    public static async getAllMarriageRequests(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.MarriageRequestWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.marriageRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    bride: { select: { firstName: true, lastName: true } },
                    groom: { select: { firstName: true, lastName: true } },
                    requester: { select: { firstName: true, lastName: true } },
                    approvedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.marriageRequest.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateMarriageRequestStatus(id: string, status: any, approvedById?: string) {
        return await prisma.marriageRequest.update({
            where: { id },
            data: {
                status,
                approvedById,
                approvedAt: status === "APPROVED" ? new Date() : undefined,
            },
        });
    }

    // Baptism Requests
    public static async createBaptismRequest(data: Prisma.BaptismRequestCreateInput) {
        return await prisma.baptismRequest.create({ data });
    }

    public static async getAllBaptismRequests(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.BaptismRequestWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.baptismRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    requester: { select: { firstName: true, lastName: true } },
                    approvedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.baptismRequest.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateBaptismRequestStatus(id: string, status: any, approvedById?: string, scheduledDate?: Date) {
        return await prisma.baptismRequest.update({
            where: { id },
            data: {
                status,
                approvedById,
                scheduledDate,
                approvedAt: status === "APPROVED" ? new Date() : undefined,
            },
        });
    }
}
