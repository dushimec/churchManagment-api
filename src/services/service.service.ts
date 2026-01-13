import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class ServiceService {
    public static async createService(data: Prisma.ServiceCreateInput) {
        return await prisma.service.create({ data });
    }

    public static async getAllServices(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.ServiceWhereInput,
        include?: Prisma.ServiceInclude,
        orderBy?: Prisma.ServiceOrderByWithRelationInput
    ) {
        const [data, total] = await Promise.all([
            prisma.service.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include,
                orderBy,
            }),
            prisma.service.count({ where }),
        ]);
        return { data, total };
    }

    public static async getServiceById(id: string, include?: Prisma.ServiceInclude) {
        return await prisma.service.findUnique({
            where: { id },
            include,
        });
    }

    public static async updateService(id: string, data: Prisma.ServiceUpdateInput) {
        return await prisma.service.update({
            where: { id },
            data,
        });
    }

    public static async deleteService(id: string) {
        return await prisma.service.delete({
            where: { id },
        });
    }

    public static async markAttendance(serviceId: string, memberId: string, method: string = "manual") {
        const attendance = await prisma.attendance.upsert({
            where: {
                serviceId_memberId: { serviceId, memberId },
            },
            update: { method },
            create: { serviceId, memberId, method },
        });

        await prisma.service.update({
            where: { id: serviceId },
            data: { attendanceCount: { increment: 1 } },
        });

        return attendance;
    }

    public static async getServiceAttendance(
        serviceId: string,
        page: number = 1,
        limit: number = 10,
        include?: Prisma.AttendanceInclude
    ) {
        const [data, total] = await Promise.all([
            prisma.attendance.findMany({
                where: { serviceId },
                skip: (page - 1) * limit,
                take: limit,
                include,
            }),
            prisma.attendance.count({ where: { serviceId } }),
        ]);
        return { data, total };
    }
}
