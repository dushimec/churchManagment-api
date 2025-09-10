import { Router } from "express";
import { AuthController } from "../controllers/auth.controller"

const router = Router();

router
    .route("/register")
    .post(AuthController.register)

export default router;
