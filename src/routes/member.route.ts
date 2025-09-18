import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { verifyAccess } from "../middlewares/authMiddleware";
import { createMemberValidator, updateMemberValidator } from "../middlewares/validations/member.validation"; 
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router
  .route("/")
  .post(...createMemberValidator, MemberController.createMember);

router
  .route("/")
  .get(verifyAccess, isAdmin, MemberController.getAllMembers);

router
  .route("/:id")
  .get(verifyAccess, isAdmin, MemberController.getMemberById);

router
  .route("/:id")
  .put(verifyAccess, isAdmin, updateMemberValidator, MemberController.updateMember);

router
  .route("/:id")
  .delete(verifyAccess, isAdmin, MemberController.deleteMember);

export default router;