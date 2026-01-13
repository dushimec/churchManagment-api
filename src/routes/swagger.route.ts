import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

const router = Router();


router.get("/swagger.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});


if (process.env.NODE_ENV !== "production") {
  router.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

export default router;
