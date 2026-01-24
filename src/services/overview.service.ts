import { prisma } from "../config/database";

export class OverviewService {
    public static async getDashboardStats() {
        const [
            youthCount,
            cellCount,
            churchCount,
            baptismCertCount,
            marriageCertCount,
            weddingCount,
            childDedicationCount,
            marriageRequestCount,
            baptismRequestCount,
            mediaCount
        ] = await Promise.all([
            prisma.youthForm.count(),
            prisma.cellRecommendation.count(),
            prisma.churchRecommendation.count(),
            prisma.baptismCertification.count(),
            prisma.marriageCertificate.count(),
            prisma.weddingServiceRequest.count(),
            prisma.childDedicationRequest.count(),
            prisma.marriageRequest.count(),
            prisma.baptismRequest.count(),
            prisma.media.count(),
        ]);

        const [
            youthApproved, cellApproved, churchApproved, baptismCertApproved, marriageCertApproved, weddingApproved, childDedicationApproved, marriageRequestApproved, baptismRequestApproved,
            youthRejected, cellRejected, churchRejected, baptismCertRejected, marriageCertRejected, weddingRejected, childDedicationRejected, marriageRequestRejected, baptismRequestRejected,
            unreadMessages
        ] = await Promise.all([
            prisma.youthForm.count({ where: { status: "APPROVED" } }),
            prisma.cellRecommendation.count({ where: { status: "APPROVED" } }),
            prisma.churchRecommendation.count({ where: { status: "APPROVED" } }),
            prisma.baptismCertification.count({ where: { status: "APPROVED" } }),
            prisma.marriageCertificate.count({ where: { status: "APPROVED" } }),
            prisma.weddingServiceRequest.count({ where: { status: "APPROVED" } }),
            prisma.childDedicationRequest.count({ where: { status: "APPROVED" } }),
            prisma.marriageRequest.count({ where: { status: "APPROVED" } }),
            prisma.baptismRequest.count({ where: { status: "APPROVED" } }),

            prisma.youthForm.count({ where: { status: "REJECTED" } }),
            prisma.cellRecommendation.count({ where: { status: "REJECTED" } }),
            prisma.churchRecommendation.count({ where: { status: "REJECTED" } }),
            prisma.baptismCertification.count({ where: { status: "REJECTED" } }),
            prisma.marriageCertificate.count({ where: { status: "REJECTED" } }),
            prisma.weddingServiceRequest.count({ where: { status: "REJECTED" } }),
            prisma.childDedicationRequest.count({ where: { status: "REJECTED" } }),
            prisma.marriageRequest.count({ where: { status: "REJECTED" } }),
            prisma.baptismRequest.count({ where: { status: "REJECTED" } }),
            prisma.contactMessage.count({ where: { read: false } }),
        ]);

        const totalRequests = youthCount + cellCount + churchCount + baptismCertCount + marriageCertCount + weddingCount + childDedicationCount + marriageRequestCount + baptismRequestCount;
        const totalApproved = youthApproved + cellApproved + churchApproved + baptismCertApproved + marriageCertApproved + weddingApproved + childDedicationApproved + marriageRequestApproved + baptismRequestApproved;
        const totalRejected = youthRejected + cellRejected + churchRejected + baptismCertRejected + marriageCertRejected + weddingRejected + childDedicationRejected + marriageRequestRejected + baptismRequestRejected;

        return {
            totalRequests,
            totalApproved,
            totalRejected,
            totalMedia: mediaCount,
            unreadMessages
        };
    }
}
