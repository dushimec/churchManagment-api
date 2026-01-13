import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class CommunicationService {
    // Notifications
    public static async createNotification(data: Prisma.NotificationCreateInput) {
        return await prisma.notification.create({ data });
    }

    public static async getNotificationsForUser(
        userId: string,
        page: number = 1,
        limit: number = 10,
        unreadOnly: boolean = false
    ) {
        const where: Prisma.NotificationWhereInput = { recipientId: userId };
        if (unreadOnly) where.read = false;

        const [data, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { sentAt: "desc" },
                include: { relatedEvent: true },
            }),
            prisma.notification.count({ where }),
        ]);
        return { data, total };
    }

    public static async markNotificationAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    public static async markAllNotificationsAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: { recipientId: userId, read: false },
            data: { read: true },
        });
    }

    // Messages
    public static async sendMessage(data: Prisma.MessageCreateInput) {
        return await prisma.message.create({ data });
    }

    public static async getChatHistory(
        user1Id: string,
        user2Id: string,
        page: number = 1,
        limit: number = 20
    ) {
        const where: Prisma.MessageWhereInput = {
            OR: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id },
            ],
        };

        const [data, total] = await Promise.all([
            prisma.message.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { timestamp: "desc" },
                include: {
                    sender: { select: { firstName: true, lastName: true } },
                    receiver: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.message.count({ where }),
        ]);
        return { data, total };
    }

    public static async markMessageAsRead(id: string) {
        return await prisma.message.update({
            where: { id },
            data: { read: true },
        });
    }
}
