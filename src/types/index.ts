
import { User, Asset } from "@prisma/client";
declare global {
  namespace Express {
    export interface Request {
      user?: DbUser;
      isEnglishPreferred?: boolean;
     
    }
  }
}

export type DbUser = User & {
  profileImage?: Asset | null;
};

export const fileSelects = {
  id: true,
  url: true,
  type: true,
  category: true,
  userId: true,
} as const;

export const profileSelects = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isVerified: true,
  language: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  phone: true,
  isEmailVerified: true,
  profileImage: {
    select: {
      url: true,
    },
  },
} as const;

type Point = {
  type: "Point";
  coordinates: [number, number];
};