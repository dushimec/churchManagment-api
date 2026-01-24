import { Prisma, User, Asset } from "@prisma/client";
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

declare module 'multer';


export const fileSelects = {
  id: true,
  url: true,
  type: true,
  category: true,
  userId: true,
} as const;


export const profileIncludes = {
  profileImage: true,
} satisfies Prisma.UserInclude;


type Point = {
  type: "Point";
  coordinates: [number, number];
};
