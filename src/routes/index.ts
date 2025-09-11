import { Router } from "express";
import signUpRoute  from "./auth.route";

const router = Router();

router.use("/auth", signUpRoute);

export default router;
