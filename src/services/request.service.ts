import { prisma } from "../config/database";

export class RequestService {
    // Youth Form
    public static async createYouthForm(data: any) {
        return await prisma.youthForm.create({ data });
    }

    public static async getAllYouthForms(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.youthForm.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.youthForm.count(),
        ]);
        return { data, total };
    }

    // Cell Recommendation
    public static async createCellRecommendation(data: any) {
        return await prisma.cellRecommendation.create({ data });
    }

    public static async getAllCellRecommendations(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.cellRecommendation.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.cellRecommendation.count(),
        ]);
        return { data, total };
    }

    // Church Recommendation
    public static async createChurchRecommendation(data: any) {
        return await prisma.churchRecommendation.create({ data });
    }

    public static async getAllChurchRecommendations(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.churchRecommendation.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.churchRecommendation.count(),
        ]);
        return { data, total };
    }

    // Baptism Certification
    public static async createBaptismCertification(data: any) {
        return await prisma.baptismCertification.create({ data });
    }

    public static async getAllBaptismCertifications(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.baptismCertification.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.baptismCertification.count(),
        ]);
        return { data, total };
    }

    // Marriage Certificate
    public static async createMarriageCertificate(data: any) {
        return await prisma.marriageCertificate.create({ data });
    }

    public static async getAllMarriageCertificates(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.marriageCertificate.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.marriageCertificate.count(),
        ]);
        return { data, total };
    }

    // Wedding Service Request
    public static async createWeddingServiceRequest(data: any) {
        return await prisma.weddingServiceRequest.create({ data });
    }

    public static async getAllWeddingServiceRequests(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.weddingServiceRequest.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.weddingServiceRequest.count(),
        ]);
        return { data, total };
    }

    // Child Dedication Request
    public static async createChildDedicationRequest(data: any) {
        return await prisma.childDedicationRequest.create({ data });
    }

    public static async getAllChildDedicationRequests(page: number = 1, limit: number = 10) {
        const [data, total] = await Promise.all([
            prisma.childDedicationRequest.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.childDedicationRequest.count(),
        ]);
        return { data, total };
    }
}
