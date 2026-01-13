import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class PastoralService {
    // Prayer Requests
    public static async createPrayerRequest(data: Prisma.PrayerRequestCreateInput) {
        return await prisma.prayerRequest.create({ data });
    }

    public static async getAllPrayerRequests(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.PrayerRequestWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.prayerRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    member: { select: { firstName: true, lastName: true, email: true } },
                    pastor: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.prayerRequest.count({ where }),
        ]);
        return { data, total };
    }

    public static async getPrayerRequestById(id: string) {
        return await prisma.prayerRequest.findUnique({
            where: { id },
            include: {
                member: { select: { firstName: true, lastName: true } },
                pastor: { select: { firstName: true, lastName: true } },
            },
        });
    }

    public static async respondToPrayerRequest(id: string, pastorId: string, response: string) {
        return await prisma.prayerRequest.update({
            where: { id },
            data: {
                pastorId,
                response,
                responded: true,
                respondedAt: new Date(),
            },
        });
    }

    // Counseling Appointments
    public static async createCounselingAppointment(data: Prisma.CounselingAppointmentCreateInput) {
        return await prisma.counselingAppointment.create({ data });
    }

    public static async getAllCounselingAppointments(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.CounselingAppointmentWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.counselingAppointment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: "desc" },
                include: {
                    member: { select: { firstName: true, lastName: true } },
                    pastor: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.counselingAppointment.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateCounselingStatus(id: string, status: any, notes?: string) {
        return await prisma.counselingAppointment.update({
            where: { id },
            data: {
                status,
                notes,
            },
        });
    }
}
