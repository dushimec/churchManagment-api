import {Prisma, User, Asset } from "@prisma/client";
export type DbUser = User & {
  profileImage?: Asset | null;
};

declare global {
  namespace Express {
    export interface Request {
      user?: DbUser | null; // <-- allow null
      isEnglishPreferred?: boolean;
    }
  }
}

export const fileSelects = {
  id: true,
  url: true,
  type: true,
  category: true,
  userId: true,
} as const;


export const profileSelects = {
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
  updatedAt: true,
  profileImage: {
    select: {
      url: true,
      publicId: true,
    },
  },
} satisfies Prisma.UserSelect;

type Point = {
  type: "Point";
  coordinates: [number, number];
};