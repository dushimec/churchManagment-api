import { body } from "express-validator";
import { AssetType } from "@prisma/client";

export const sermonValidator = [
    body("title")
        .isString()
        .notEmpty()
        .withMessage("Title is required"),
    body("preacherId")
        .isString()
        .notEmpty()
        .withMessage("Preacher ID is required"),
    body("serviceId")
        .optional()
        .isString()
        .withMessage("Service ID must be a string"),
    body("theme")
        .optional()
        .isString()
        .withMessage("Theme must be a string"),
    body("scripture")
        .optional()
        .isString()
        .withMessage("Scripture must be a string"),
    body("audioUrl")
        .optional()
        .isURL()
        .withMessage("Audio URL must be a valid URL"),
    body("videoUrl")
        .optional()
        .isURL()
        .withMessage("Video URL must be a valid URL"),
    body("text")
        .optional()
        .isString()
        .withMessage("Text must be a string"),
    body("tags")
        .optional()
        .isString()
        .withMessage("Tags must be a string"),
];

export const mediaValidator = [
    body("title")
        .optional()
        .isString()
        .withMessage("Title must be a string"),
    body("url")
        .isURL()
        .withMessage("URL must be a valid URL"),
    body("type")
        .isIn(Object.values(AssetType))
        .withMessage(`Type must be one of: ${Object.values(AssetType).join(", ")}`),
    body("sermonId")
        .optional()
        .isString()
        .withMessage("Sermon ID must be a string"),
    body("userId")
        .optional()
        .isString()
        .withMessage("User ID must be a string"),
];
