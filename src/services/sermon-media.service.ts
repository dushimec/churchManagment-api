import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class SermonMediaService {
    // Sermons
    public static async createSermon(data: Prisma.SermonCreateInput) {
        return await prisma.sermon.create({ data });
    }

    public static async getAllSermons(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.SermonWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.sermon.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: "desc" },
                include: {
                    preacher: { select: { firstName: true, lastName: true } },
                    service: true,
                    Media: true,
                },
            }),
            prisma.sermon.count({ where }),
        ]);
        return { data, total };
    }

    public static async getSermonById(id: string) {
        return await prisma.sermon.findUnique({
            where: { id },
            include: {
                preacher: { select: { firstName: true, lastName: true } },
                service: true,
                Media: true,
            },
        });
    }

    public static async updateSermon(id: string, data: Prisma.SermonUpdateInput) {
        return await prisma.sermon.update({
            where: { id },
            data,
        });
    }

    public static async deleteSermon(id: string) {
        return await prisma.sermon.delete({
            where: { id },
        });
    }

    // Media
    public static async createMedia(data: Prisma.MediaCreateInput) {
        return await prisma.media.create({ data });
    }

    public static async getAllMedia(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.MediaWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.media.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    sermon: true,
                    user: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.media.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateMedia(id: string, data: Prisma.MediaUpdateInput) {
        return await prisma.media.update({
            where: { id },
            data,
        });
    }

    public static async deleteMedia(id: string) {
        return await prisma.media.delete({
            where: { id },
        });
    }
}
