import { Router } from "express";
import { FormController } from "../controllers/form.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import * as validator from "../middlewares/validations/form.validation";

const router = Router();

/**
 * @route POST /api/forms/youth
 * @desc Create a new youth form
 * @access Public/Member
 */
router.post("/youth", validator.youthFormValidator, FormController.createYouthForm);

/**
 * @route GET /api/forms/youth
 * @desc Get all youth forms
 * @access Admin/Pastor
 */
router.get("/youth", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllYouthForms);

// Cell Recommendation
router.post("/cell-recommendation", validator.cellRecommendationValidator, FormController.createCellRecommendation);
router.get("/cell-recommendation", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllCellRecommendations);

// Church Recommendation
router.post("/church-recommendation", validator.churchRecommendationValidator, FormController.createChurchRecommendation);
router.get("/church-recommendation", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllChurchRecommendations);

// Baptism Certification
router.post("/baptism-certification", validator.baptismCertificationValidator, FormController.createBaptismCertification);
router.get("/baptism-certification", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllBaptismCertifications);

// Marriage Certificate
router.post("/marriage-certificate", validator.marriageCertificateValidator, FormController.createMarriageCertificate);
router.get("/marriage-certificate", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllMarriageCertificates);

// Wedding Service Request
router.post("/wedding-request", validator.weddingServiceRequestValidator, FormController.createWeddingServiceRequest);
router.get("/wedding-request", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllWeddingServiceRequests);

// Child Dedication Request
router.post("/child-dedication", validator.childDedicationRequestValidator, FormController.createChildDedicationRequest);
router.get("/child-dedication", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.getAllChildDedicationRequests);

// Confirm/Reject forms
router.patch("/:formType/:formId/confirm", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.confirmForm);
router.patch("/:formType/:formId/reject", verifyAccess, restrictTo(Role.ADMIN, Role.PASTOR), FormController.rejectForm);

export default router;
