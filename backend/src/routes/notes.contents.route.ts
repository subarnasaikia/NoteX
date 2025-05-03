import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    createContent,
    fetchContentUsingId,
    updateContentUsingId,
    deleteContentUsingId,
} from "../controllers/notes.contents.controller.js";

const router: Router = Router();
router.use(verfiyJWT);
router.route("/create-content").post(createContent);
router.route("/fetch-content/:contentId").get(fetchContentUsingId);
router.route("/update-content/:contentId").patch(updateContentUsingId);
router.route("/delete-content/:contentId").delete(deleteContentUsingId);
// TODO(subarna): add search content using search query

export default router;
