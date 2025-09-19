import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: any) => {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal server error.",
      });
    });
  };
};


