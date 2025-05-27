import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
} from "../controllers/user.controller.js";
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verfiyJWT, logoutUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/me").get(verfiyJWT, getCurrentUser);

export default router;
