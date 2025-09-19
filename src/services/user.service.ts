import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class UserService {
  public static async getUser(
    where: Prisma.UserWhereInput,
    include?: Prisma.UserInclude
  ) {
    return await prisma.user.findFirst({
      where,
      include,
    });
  }

  public static async getUserByUnique(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ) {
    return await prisma.user.findUnique({
      where,
      include,
    });
  }

  public static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    where?: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
  ) {
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select,
      orderBy,
    });

    const total = await prisma.user.count({ where });
    return { users, total };
  }

  public static async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect
  ) {
    return await prisma.user.update({
      where: { id },
      data,
      select,
    });
  }

  public static async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 10
  ) {
    const where: Prisma.UserWhereInput = {
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
      ],
      isDeleted: false, 
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          language: true,
          avatarUrl: true,
          isEmailVerified: true,
          is2FAEnabled: true,
          phoneVerified: true,
          status: true,
          createdAt: true,
        },
        orderBy: { firstName: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  public static async updateUserRole(id: string, role: Prisma.UserUpdateInput["role"]) {
    return await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  public static async toggle2FA(id: string, enable: boolean) {
    return await prisma.user.update({
      where: { id },
      data: { is2FAEnabled: enable },
      select: {
        id: true,
        is2FAEnabled: true,
      },
    });
  }

  public static async updateProfileImage(
    userId: string,
    url: string,
    publicId: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profileImage: true },
    });

    if (!user) throw new Error("User not found");

    if (user.profileImage) {
      await prisma.asset.delete({
        where: { id: user.profileImage.id },
      });
    }

    const newAsset = await prisma.asset.create({
      data: {
        url,
        publicId,
        type: "IMAGE",
        category: "PROFILE_IMAGE",
        userId,
      },
    });

    return await prisma.user.update({
      where: { id: userId },
      data: {
        profileImageId: newAsset.id,
        avatarUrl: url,
      },
      include: { profileImage: true },
    });
  }
}