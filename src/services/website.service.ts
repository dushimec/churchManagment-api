import { prisma } from "../config/database";
import { AboutSectionType } from "@prisma/client";

export class WebsiteService {
    // About Sections
    public static async getAboutSections() {
        return await prisma.aboutSection.findMany();
    }

    public static async upsertAboutSection(type: AboutSectionType, title: string, content: string) {
        return await prisma.aboutSection.upsert({
            where: { type },
            update: { title, content },
            create: { type, title, content }
        });
    }

    // Leadership
    public static async getLeadership() {
        return await prisma.leadership.findMany({
            orderBy: { sequence: 'asc' }
        });
    }

    public static async addLeadership(data: any) {
        return await prisma.leadership.create({ data });
    }

    public static async updateLeadership(id: string, data: any) {
        return await prisma.leadership.update({
            where: { id },
            data
        });
    }

    public static async deleteLeadership(id: string) {
        return await prisma.leadership.delete({
            where: { id }
        });
    }

    // Contact Info
    public static async getContactInfo() {
        return await prisma.contactInfo.findFirst();
    }

    public static async upsertContactInfo(data: any) {
        const info = await prisma.contactInfo.findFirst();
        if (info) {
            return await prisma.contactInfo.update({
                where: { id: info.id },
                data
            });
        }
        return await prisma.contactInfo.create({ data });
    }
}
