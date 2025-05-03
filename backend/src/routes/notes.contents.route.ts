import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router: Router = Router();
router.use(verfiyJWT);

export default router;
