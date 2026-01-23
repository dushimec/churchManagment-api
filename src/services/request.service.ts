import { prisma } from "../config/database";
import { RequestStatus } from "@prisma/client";
import { sendFormConfirmationEmail, sendFormRejectionEmail } from "../config/email";
import { Language } from "@prisma/client";

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

    // Confirm/Reject methods
    public static async confirmForm(formType: string, formId: string) {
        let result: any;
        let email: string | string[] = '';
        let formData: any;

        switch (formType) {
            case 'youth':
                result = await prisma.youthForm.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = result.email;
                formData = result;
                break;
            case 'cell-recommendation':
                result = await prisma.cellRecommendation.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = result.email;
                formData = result;
                break;
            case 'church-recommendation':
                result = await prisma.churchRecommendation.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = result.email || '';
                formData = result;
                break;
            case 'baptism-certification':
                result = await prisma.baptismCertification.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = result.email;
                formData = result;
                break;
            case 'marriage-certificate':
                result = await prisma.marriageCertificate.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = [result.brideEmail, result.groomEmail];
                formData = result;
                break;
            case 'wedding-request':
                result = await prisma.weddingServiceRequest.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = [result.brideEmail, result.groomEmail];
                formData = result;
                break;
            case 'child-dedication':
                result = await prisma.childDedicationRequest.update({
                    where: { id: formId },
                    data: { status: RequestStatus.APPROVED },
                });
                email = result.parentEmail;
                formData = result;
                break;
            default:
                throw new Error(`Unknown form type: ${formType}`);
        }

        // Send email notification
        if (email) {
            const emails = Array.isArray(email) ? email : [email];
            const language = Language.EN; // You can get this from user preferences if needed
            for (const emailAddr of emails) {
                if (emailAddr) {
                    try {
                        await sendFormConfirmationEmail(emailAddr, formType, formData, language);
                    } catch (error) {
                        console.error(`Failed to send confirmation email to ${emailAddr}:`, error);
                    }
                }
            }
        }

        return result;
    }

    public static async rejectForm(formType: string, formId: string, reason?: string) {
        let result: any;
        let email: string | string[] = '';

        switch (formType) {
            case 'youth':
                result = await prisma.youthForm.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = result.email;
                break;
            case 'cell-recommendation':
                result = await prisma.cellRecommendation.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = result.email;
                break;
            case 'church-recommendation':
                result = await prisma.churchRecommendation.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = result.email || '';
                break;
            case 'baptism-certification':
                result = await prisma.baptismCertification.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = result.email;
                break;
            case 'marriage-certificate':
                result = await prisma.marriageCertificate.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = [result.brideEmail, result.groomEmail];
                break;
            case 'wedding-request':
                result = await prisma.weddingServiceRequest.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = [result.brideEmail, result.groomEmail];
                break;
            case 'child-dedication':
                result = await prisma.childDedicationRequest.update({
                    where: { id: formId },
                    data: { status: RequestStatus.REJECTED },
                });
                email = result.parentEmail;
                break;
            default:
                throw new Error(`Unknown form type: ${formType}`);
        }

        // Send email notification
        if (email) {
            const emails = Array.isArray(email) ? email : [email];
            const language = Language.EN; // You can get this from user preferences if needed
            for (const emailAddr of emails) {
                if (emailAddr) {
                    try {
                        await sendFormRejectionEmail(emailAddr, formType, reason, language);
                    } catch (error) {
                        console.error(`Failed to send rejection email to ${emailAddr}:`, error);
                    }
                }
            }
        }

        return result;
    }
}
