import { prisma } from "../config/database";
import { sendFormStatusEmail } from "../config/email";

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
    // Dynamic Confirm/Reject logic
    public static async confirmForm(formType: string, id: string) {
        let result: any;
        switch (formType) {
            case "youth":
                result = await prisma.youthForm.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.email, result.name, "Youth Form", "APPROVED");
                break;
            case "cell-recommendation":
                result = await prisma.cellRecommendation.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.email, result.names, "Cell Recommendation", "APPROVED");
                break;
            case "church-recommendation":
                result = await prisma.churchRecommendation.update({ where: { id }, data: { status: "APPROVED" } });
                if (result.email) await sendFormStatusEmail(result.email, result.name, "Church Recommendation", "APPROVED");
                break;
            case "baptism-certification":
                result = await prisma.baptismCertification.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.email, result.name, "Baptism Certification", "APPROVED");
                break;
            case "marriage-certificate":
                result = await prisma.marriageCertificate.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.brideEmail, result.brideName, "Marriage Certificate (Bride)", "APPROVED");
                await sendFormStatusEmail(result.groomEmail, result.groomName, "Marriage Certificate (Groom)", "APPROVED");
                break;
            case "wedding-request":
                result = await prisma.weddingServiceRequest.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.brideEmail, result.brideName, "Wedding Request (Bride)", "APPROVED");
                await sendFormStatusEmail(result.groomEmail, result.groomName, "Wedding Request (Groom)", "APPROVED");
                break;
            case "child-dedication":
                result = await prisma.childDedicationRequest.update({ where: { id }, data: { status: "APPROVED" } });
                await sendFormStatusEmail(result.parentEmail, result.parentNames, "Child Dedication Request", "APPROVED");
                break;
            case "marriage-request":
                result = await prisma.marriageRequest.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date() } });
                if (result.requesterEmail) await sendFormStatusEmail(result.requesterEmail, result.requesterName || "Requester", "Marriage Request", "APPROVED");
                if (result.brideEmail) await sendFormStatusEmail(result.brideEmail, result.brideName || "Bride", "Marriage Request", "APPROVED");
                if (result.groomEmail) await sendFormStatusEmail(result.groomEmail, result.groomName || "Groom", "Marriage Request", "APPROVED");
                break;
            case "baptism-request":
                result = await prisma.baptismRequest.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date() } });
                if (result.requesterEmail) await sendFormStatusEmail(result.requesterEmail, result.requesterName || "Requester", "Baptism Request", "APPROVED");
                break;
            default:
                throw new Error("Invalid form type");
        }
        return result;
    }

    public static async rejectForm(formType: string, id: string, reason?: string) {
        let result: any;
        switch (formType) {
            case "youth":
                result = await prisma.youthForm.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.email, result.name, "Youth Form", "REJECTED", undefined, reason);
                break;
            case "cell-recommendation":
                result = await prisma.cellRecommendation.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.email, result.names, "Cell Recommendation", "REJECTED", undefined, reason);
                break;
            case "church-recommendation":
                result = await prisma.churchRecommendation.update({ where: { id }, data: { status: "REJECTED" } });
                if (result.email) await sendFormStatusEmail(result.email, result.name, "Church Recommendation", "REJECTED", undefined, reason);
                break;
            case "baptism-certification":
                result = await prisma.baptismCertification.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.email, result.name, "Baptism Certification", "REJECTED", undefined, reason);
                break;
            case "marriage-certificate":
                result = await prisma.marriageCertificate.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.brideEmail, result.brideName, "Marriage Certificate (Bride)", "REJECTED", undefined, reason);
                await sendFormStatusEmail(result.groomEmail, result.groomName, "Marriage Certificate (Groom)", "REJECTED", undefined, reason);
                break;
            case "wedding-request":
                result = await prisma.weddingServiceRequest.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.brideEmail, result.brideName, "Wedding Request (Bride)", "REJECTED", undefined, reason);
                await sendFormStatusEmail(result.groomEmail, result.groomName, "Wedding Request (Groom)", "REJECTED", undefined, reason);
                break;
            case "child-dedication":
                result = await prisma.childDedicationRequest.update({ where: { id }, data: { status: "REJECTED" } });
                await sendFormStatusEmail(result.parentEmail, result.parentNames, "Child Dedication Request", "REJECTED", undefined, reason);
                break;
            case "marriage-request":
                result = await prisma.marriageRequest.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason } });
                if (result.requesterEmail) await sendFormStatusEmail(result.requesterEmail, result.requesterName || "Requester", "Marriage Request", "REJECTED", undefined, reason);
                break;
            case "baptism-request":
                result = await prisma.baptismRequest.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason } });
                if (result.requesterEmail) await sendFormStatusEmail(result.requesterEmail, result.requesterName || "Requester", "Baptism Request", "REJECTED", undefined, reason);
                break;
            default:
                throw new Error("Invalid form type");
        }
        return result;
    }
}
