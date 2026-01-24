import { body } from "express-validator";

export const youthFormValidator = [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("idNumber").isString().notEmpty().withMessage("ID Number is required"),
    body("phone").isString().notEmpty().withMessage("Phone is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("district").isString().notEmpty().withMessage("District is required"),
    body("sector").isString().notEmpty().withMessage("Sector is required"),
    body("churchCell").isString().notEmpty().withMessage("Church Cell is required"),
    body("youthFamily").isString().notEmpty().withMessage("Youth Family is required"),
];

export const cellRecommendationValidator = [
    body("names").isString().notEmpty().withMessage("Names are required"),
    body("idNumber").isString().notEmpty().withMessage("ID Number is required"),
    body("phone").isString().notEmpty().withMessage("Phone is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("district").isString().notEmpty().withMessage("District is required"),
    body("sector").isString().notEmpty().withMessage("Sector is required"),
    body("churchCellName").isString().notEmpty().withMessage("Church Cell Name is required"),
];

export const churchRecommendationValidator = [
    body("type").isIn(["YOUTH", "OLD"]).withMessage("Type must be YOUTH or OLD"),
    body("idNumber").isString().notEmpty().withMessage("ID Number is required"),
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("email").optional().isEmail().withMessage("Valid email required"),
    body("phone").optional().isString(),
    body("district").isString().notEmpty().withMessage("District is required"),
    body("sector").isString().notEmpty().withMessage("Sector is required"),
    body("cellRecommendation").isString().notEmpty().withMessage("Cell recommendation is required"),
    body("youthRecommendation").optional().isString(),
    body("passportPhoto").optional().isString(),
];

export const baptismCertificationValidator = [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email are required"),
    body("phone").isString().notEmpty().withMessage("Phone is required"),
    body("baptismDate").isISO8601().withMessage("Valid baptism date is required"),
];

export const marriageCertificateValidator = [
    body("brideName").isString().notEmpty().withMessage("Bride name is required"),
    body("groomName").isString().notEmpty().withMessage("Groom name is required"),
    body("brideEmail").isEmail().withMessage("Valid bride email is required"),
    body("groomEmail").isEmail().withMessage("Valid groom email is required"),
    body("bridePhone").isString().notEmpty().withMessage("Bride phone is required"),
    body("groomPhone").isString().notEmpty().withMessage("Groom phone is required"),
    body("brideAddress").isString().notEmpty().withMessage("Bride address is required"),
    body("groomAddress").isString().notEmpty().withMessage("Groom address is required"),
];


export const weddingServiceRequestValidator = [
    body("brideName").isString().notEmpty().withMessage("Bride name is required"),
    body("groomName").isString().notEmpty().withMessage("Groom name is required"),
    body("brideEmail").isEmail().withMessage("Valid bride email is required"),
    body("groomEmail").isEmail().withMessage("Valid groom email is required"),
    body("bridePhone").isString().notEmpty().withMessage("Bride phone is required"),
    body("groomPhone").isString().notEmpty().withMessage("Groom phone is required"),
    body("marenName").isString().notEmpty().withMessage("Parent name (Mother) is required"),
    body("parenName").isString().notEmpty().withMessage("Parent name (Father) is required"),
    body("idCopies").optional().isArray().withMessage("ID copies must be an array"),
];


export const childDedicationRequestValidator = [
    body("parentNames").isString().notEmpty().withMessage("Parent names are required"),
    body("childNames").isString().notEmpty().withMessage("Child names are required"),
    body("dateOfBirth").isISO8601().withMessage("Valid date of birth is required"),
    body("parentPhone").isString().notEmpty().withMessage("Parent phone is required"),
    body("parentEmail").isEmail().withMessage("Valid parent email is required"),
    body("dedicationDate").isISO8601().withMessage("Valid dedication date is required"),
    body("churchService").isString().notEmpty().withMessage("Church service is required"),
];
