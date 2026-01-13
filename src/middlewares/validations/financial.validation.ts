import { body } from "express-validator";
import { ContributionType, PaymentMethod } from "@prisma/client";

export const contributionValidator = [
    body("amount")
        .isNumeric()
        .withMessage("Amount must be a number")
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new Error("Amount must be greater than 0");
            }
            return true;
        }),
    body("contributionType")
        .isIn(Object.values(ContributionType))
        .withMessage(`Type must be one of: ${Object.values(ContributionType).join(", ")}`),
    body("paymentMethod")
        .isIn(Object.values(PaymentMethod))
        .withMessage(`Payment method must be one of: ${Object.values(PaymentMethod).join(", ")}`),
    body("transactionId")
        .isString()
        .notEmpty()
        .withMessage("Transaction ID is required"),
    body("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string"),
];
