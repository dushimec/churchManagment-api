import { body } from "express-validator";

export const messageValidator = [
    body("receiverId")
        .isString()
        .notEmpty()
        .withMessage("Receiver ID is required"),
    body("content")
        .isString()
        .notEmpty()
        .withMessage("Message content is required")
        .isLength({ max: 1000 })
        .withMessage("Message cannot exceed 1000 characters"),
];
