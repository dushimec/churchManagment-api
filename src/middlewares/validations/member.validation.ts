import { body } from "express-validator";

export const createMemberValidator = 
  [
  body("names").isString().notEmpty(),
  body("email").optional().isEmail(),
  body("phoneNumber").optional().isString(),
  body("idNumber").optional().isString(),
  body("district").optional().isString(),
  body("sector").optional().isString(),
  body("cell").optional().isString(),
  body("churchCell").optional().isString(),
  body("dateOfBirth").optional().isISO8601(),
  body("gender").optional().isString(),
  body("maritalStatus").optional().isString(),
  body("nationality").optional().isString(),
  body("occupation").optional().isString(),
  body("address").optional().isString(),
  body("baptismDate").optional().isISO8601(),
  body("confirmationDate").optional().isISO8601(),
  body("spiritualMaturity").optional().isString(),
  body("ministryPreferences").optional().isArray(),
];


export const updateMemberValidator = 
  [
  body("names").isString().notEmpty(),
  body("email").optional().isEmail(),
  body("phoneNumber").optional().isString(),
  body("idNumber").optional().isString(),
  body("district").optional().isString(),
  body("sector").optional().isString(),
  body("cell").optional().isString(),
  body("churchCell").optional().isString(),
  body("dateOfBirth").optional().isISO8601(),
  body("gender").optional().isString(),
  body("maritalStatus").optional().isString(),
  body("nationality").optional().isString(),
  body("occupation").optional().isString(),
  body("address").optional().isString(),
  body("baptismDate").optional().isISO8601(),
  body("confirmationDate").optional().isISO8601(),
  body("spiritualMaturity").optional().isString(),
  body("ministryPreferences").optional().isArray(),
];
