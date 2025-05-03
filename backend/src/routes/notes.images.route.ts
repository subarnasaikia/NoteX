import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    createImage,
    deleteImage,
} from "../controllers/notes.images.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router: Router = Router();
router.use(verfiyJWT);
router.route("/add-image").post(upload.single("imagePath"), createImage);
router.route("/delete-image/:imageId").delete(deleteImage);
export default router;
