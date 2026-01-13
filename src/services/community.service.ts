import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class CommunityService {
    // Events
    public static async createEvent(data: Prisma.EventCreateInput) {
        return await prisma.event.create({ data });
    }

    public static async getAllEvents(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.EventWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: "asc" },
                include: {
                    organizer: { select: { firstName: true, lastName: true } },
                    _count: { select: { registrations: true } },
                },
            }),
            prisma.event.count({ where }),
        ]);
        return { data, total };
    }

    public static async getEventById(id: string) {
        return await prisma.event.findUnique({
            where: { id },
            include: {
                organizer: { select: { firstName: true, lastName: true } },
                registrations: {
                    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
                },
            },
        });
    }

    public static async updateEvent(id: string, data: Prisma.EventUpdateInput) {
        return await prisma.event.update({
            where: { id },
            data,
        });
    }

    public static async deleteEvent(id: string) {
        return await prisma.event.delete({
            where: { id },
        });
    }

    // Event Registrations
    public static async registerForEvent(eventId: string, userId: string) {
        return await prisma.eventRegistration.create({
            data: {
                event: { connect: { id: eventId } },
                user: { connect: { id: userId } },
            },
        });
    }

    public static async unregisterFromEvent(eventId: string, userId: string) {
        return await prisma.eventRegistration.delete({
            where: {
                eventId_userId: { eventId, userId },
            },
        });
    }

    public static async getEventRegistrations(eventId: string) {
        return await prisma.eventRegistration.findMany({
            where: { eventId },
            include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
            },
        });
    }
}
