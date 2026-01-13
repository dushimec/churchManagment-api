import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class MemberService {
    public static async createMember(data: Prisma.MemberCreateInput) {
        return await prisma.member.create({ data });
    }

    public static async getAllMembers(
        page: number = 1,
        limit: number = 10,
        where?: Prisma.MemberWhereInput,
        orderBy?: Prisma.MemberOrderByWithRelationInput
    ) {
        const [data, total] = await Promise.all([
            prisma.member.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
            }),
            prisma.member.count({ where }),
        ]);
        return { data, total };
    }

    public static async getMemberById(id: string) {
        return await prisma.member.findUnique({
            where: { id },
        });
    }

    public static async updateMember(id: string, data: Prisma.MemberUpdateInput) {
        return await prisma.member.update({
            where: { id },
            data,
        });
    }

    public static async deleteMember(id: string) {
        return await prisma.member.delete({
            where: { id },
        });
    }
}
