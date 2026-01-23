import { Prisma, RequestStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { sendFormConfirmationEmail, sendFormRejectionEmail } from "../config/email";
import { Language } from "@prisma/client";

export class CertificationRequestService {
    // Marriage Requests
    public static async createMarriageRequest(data: Prisma.MarriageRequestCreateInput) {
        return await prisma.marriageRequest.create({ data });
    }

    public static async getAllMarriageRequests(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.MarriageRequestWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.marriageRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    bride: { select: { firstName: true, lastName: true } },
                    groom: { select: { firstName: true, lastName: true } },
                    requester: { select: { firstName: true, lastName: true } },
                    approvedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.marriageRequest.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateMarriageRequestStatus(id: string, status: any, approvedById?: string, rejectionReason?: string) {
        const updateData: any = {
            status,
            approvedById,
            approvedAt: status === RequestStatus.APPROVED ? new Date() : undefined,
        };

        if (status === RequestStatus.REJECTED && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const result = await prisma.marriageRequest.update({
            where: { id },
            data: updateData,
            include: {
                bride: { select: { language: true } },
            },
        });

        // Send email notifications
        const language = result.bride.language || Language.EN;
        if (status === RequestStatus.APPROVED) {
            if (result.brideEmail) {
                try {
                    await sendFormConfirmationEmail(result.brideEmail, 'marriage', result, language);
                } catch (error) {
                    console.error(`Failed to send confirmation email to bride:`, error);
                }
            }
            if (result.groomEmail) {
                try {
                    await sendFormConfirmationEmail(result.groomEmail, 'marriage', result, language);
                } catch (error) {
                    console.error(`Failed to send confirmation email to groom:`, error);
                }
            }
        } else if (status === RequestStatus.REJECTED) {
            if (result.brideEmail) {
                try {
                    await sendFormRejectionEmail(result.brideEmail, 'marriage', rejectionReason, language);
                } catch (error) {
                    console.error(`Failed to send rejection email to bride:`, error);
                }
            }
            if (result.groomEmail) {
                try {
                    await sendFormRejectionEmail(result.groomEmail, 'marriage', rejectionReason, language);
                } catch (error) {
                    console.error(`Failed to send rejection email to groom:`, error);
                }
            }
        }

        return result;
    }

    // Baptism Requests
    public static async createBaptismRequest(data: Prisma.BaptismRequestCreateInput) {
        return await prisma.baptismRequest.create({ data });
    }

    public static async getAllBaptismRequests(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.BaptismRequestWhereInput
    ) {
        const [data, total] = await Promise.all([
            prisma.baptismRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    requester: { select: { firstName: true, lastName: true } },
                    approvedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            prisma.baptismRequest.count({ where }),
        ]);
        return { data, total };
    }

    public static async updateBaptismRequestStatus(id: string, status: any, approvedById?: string, scheduledDate?: Date, rejectionReason?: string) {
        const updateData: any = {
            status,
            approvedById,
            scheduledDate,
            approvedAt: status === RequestStatus.APPROVED ? new Date() : undefined,
        };

        if (status === RequestStatus.REJECTED && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const result = await prisma.baptismRequest.update({
            where: { id },
            data: updateData,
            include: {
                requester: { select: { language: true } },
            },
        });

        // Send email notification
        const language = result.requester.language || Language.EN;
        if (status === RequestStatus.APPROVED) {
            if (result.requesterEmail) {
                try {
                    await sendFormConfirmationEmail(result.requesterEmail, 'baptism', result, language);
                } catch (error) {
                    console.error(`Failed to send confirmation email:`, error);
                }
            }
        } else if (status === RequestStatus.REJECTED) {
            if (result.requesterEmail) {
                try {
                    await sendFormRejectionEmail(result.requesterEmail, 'baptism', rejectionReason, language);
                } catch (error) {
                    console.error(`Failed to send rejection email:`, error);
                }
            }
        }

        return result;
    }
}
