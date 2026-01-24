import { prisma } from "../config/database";

export class ContactService {
    public static async createMessage(data: any) {
        return await prisma.contactMessage.create({ data });
    }

    public static async getAllMessages(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.contactMessage.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.contactMessage.count(),
        ]);
        return { data, total };
    }

    public static async markAsRead(id: string) {
        return await prisma.contactMessage.update({
            where: { id },
            data: { read: true }
        });
    }

    public static async deleteMessage(id: string) {
        return await prisma.contactMessage.delete({
            where: { id }
        });
    }
}
