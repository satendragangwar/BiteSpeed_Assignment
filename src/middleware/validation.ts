import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const identifySchema = z
  .object({
    email: z.string().email().nullish(),
    phoneNumber: z.string().nullish(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "At least one of email or phoneNumber must be provided",
  });

export const validateIdentifyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = identifySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      status: "error",
      message: result.error.errors[0].message,
    });
    return;
  }

  next();
};
