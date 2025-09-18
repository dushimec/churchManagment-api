import { Router } from "express";
import signUpRoute  from "./auth.route";
import userRoute  from "./user.route";
import memberRoute from "./member.route"
import { requestLogger } from "../middlewares/requestLogger";

const router = Router();

router.use(requestLogger);

router.get("/", (_, res) => {
  res.json({ message: "Welcome to the church management API" });
});

router.use("/auth", signUpRoute);
router.use("/users", userRoute);
router.use("/members", memberRoute);

export default router;
