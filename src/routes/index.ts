import { Router } from "express";
import signUpRoute from "./auth.route";
import userRoute from "./user.route";
import memberRoute from "./member.route";
import formRoute from "./form.route";
import serviceRoute from "./service.route";
import pastoralRoute from "./pastoral.route";
import financialRoute from "./financial.route";
import sermonRoute from "./sermon.route";
import mediaRoute from "./media.route";
import certificationRoute from "./certification.route";
import communicationRoute from "./communication.route";
import communityRoute from "./community.route";
import { requestLogger } from "../middlewares/requestLogger";

const router = Router();

router.use(requestLogger);

router.get("/", (_, res) => {
  res.json({ message: "Welcome to the church management API" });
});

router.use("/auth", signUpRoute);
router.use("/users", userRoute);
router.use("/members", memberRoute);
router.use("/forms", formRoute);
router.use("/services", serviceRoute);
router.use("/pastoral", pastoralRoute);
router.use("/finance", financialRoute);
router.use("/sermons", sermonRoute);
router.use("/media", mediaRoute);
router.use("/certifications", certificationRoute);
router.use("/communication", communicationRoute);
router.use("/community", communityRoute);

export default router;
