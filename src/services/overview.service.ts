import { prisma } from "../config/database";

export class OverviewService {
    public static async getDashboardStats() {
        const results = await Promise.all([
            // Counts
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

            // Approved
            prisma.youthForm.count({ where: { status: "APPROVED" } }),
            prisma.cellRecommendation.count({ where: { status: "APPROVED" } }),
            prisma.churchRecommendation.count({ where: { status: "APPROVED" } }),
            prisma.baptismCertification.count({ where: { status: "APPROVED" } }),
            prisma.marriageCertificate.count({ where: { status: "APPROVED" } }),
            prisma.weddingServiceRequest.count({ where: { status: "APPROVED" } }),
            prisma.childDedicationRequest.count({ where: { status: "APPROVED" } }),
            prisma.marriageRequest.count({ where: { status: "APPROVED" } }),
            prisma.baptismRequest.count({ where: { status: "APPROVED" } }),

            // Rejected
            prisma.youthForm.count({ where: { status: "REJECTED" } }),
            prisma.cellRecommendation.count({ where: { status: "REJECTED" } }),
            prisma.churchRecommendation.count({ where: { status: "REJECTED" } }),
            prisma.baptismCertification.count({ where: { status: "REJECTED" } }),
            prisma.marriageCertificate.count({ where: { status: "REJECTED" } }),
            prisma.weddingServiceRequest.count({ where: { status: "REJECTED" } }),
            prisma.childDedicationRequest.count({ where: { status: "REJECTED" } }),
            prisma.marriageRequest.count({ where: { status: "REJECTED" } }),
            prisma.baptismRequest.count({ where: { status: "REJECTED" } }),

            // Other
            prisma.contactMessage.count({ where: { read: false } }),
            prisma.prayerRequest.count({ where: { responded: false } }),
            prisma.counselingAppointment.count({ where: { status: "PENDING" } })
        ]);

        const totalRequests = results[0] + results[1] + results[2] + results[3] + results[4] + results[5] + results[6] + results[7] + results[8];
        const totalApproved = results[10] + results[11] + results[12] + results[13] + results[14] + results[15] + results[16] + results[17] + results[18];
        const totalRejected = results[19] + results[20] + results[21] + results[22] + results[23] + results[24] + results[25] + results[26] + results[27];

        const mediaCount = results[9];
        const unreadMessages = results[28];
        const pendingPrayerRequests = results[29];
        const pendingAppointments = results[30];

        return {
            totalRequests,
            totalApproved,
            totalRejected,
            totalMedia: mediaCount,
            unreadMessages,
            pendingPrayerRequests,
            pendingAppointments
        };
    }
}
