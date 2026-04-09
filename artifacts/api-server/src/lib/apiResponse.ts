import type { NextFunction, Request, Response } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function withErrorHandling(handler: AsyncHandler): AsyncHandler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error(`[API Error] ${req.method} ${req.originalUrl}`, error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "Something went wrong. Please try again.",
      });
    }
  };
}

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

export function empty(res: Response, message = "No data found.") {
  return res.status(200).json({
    success: true,
    empty: true,
    message,
    data: null,
  });
}
