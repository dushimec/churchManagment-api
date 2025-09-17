import {Request, Response, NextFunction } from "express";
import {Role} from "@prisma/client";
import { AppError } from "../utils/AppError";

export const isAdmin = (req: Request, res:Response, next:NextFunction ) =>{
    if (req.user!.role !== Role.ADMIN){
        return next(
            AppError(
                req.isEnglishPreferred
          ? "Access denied. Admin privileges required"
          : "Accès refusé. Privilèges administrateur requis",
        403
            )
        )
    }
    next();
}