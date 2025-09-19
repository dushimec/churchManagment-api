import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAccess } from "../middlewares/authMiddleware";
import { loginValidation, registerValidation } from "../middlewares/validations/auth.validation";

const router = Router();

router
    .route("/register")
    .post(...registerValidation, AuthController.register);

router
    .route("/login")
    .post(...loginValidation, AuthController.login);

router
    .route("/refresh-token")
    .post(AuthController.refreshAccessToken);

router
    .route("/forgot-password")
    .post(AuthController.forgotPassword);

router
    .route("/reset-password")
    .post(AuthController.resetPassword);

router
    .route("/enable-2fa")
    .post( AuthController.enable2FA);

router 
    .route("/verify-2fa")
    .post( AuthController.verify2FA);

router 
    .route("/verify-2fa-code")
    .post( AuthController.verify2FACode);

router
    .route("/send-verification-sms")
    .post(AuthController.sendVerificationSMS);

router
    .route("/logout")
    .post(verifyAccess, AuthController.logout);

router
    .route("/verify-email")
    .post( AuthController.verifyEmail);

router
    .route("/verify-phone")
    .post( AuthController.verifyPhone);

export default router;
