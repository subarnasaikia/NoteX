import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    generateRevisionHandler,
    fetchRevisionsHandler,
    fetchRevisionByIdHandler,
    fetchAllRevisionsHandler,
} from "../controllers/revision.controller.js";

const router: Router = Router();
router.use(verfiyJWT);
router.route("/generate-revision").post(generateRevisionHandler);
router
    .route("/fetch-revisions/page/:page/limit/:limit")
    .get(fetchRevisionsHandler);
router.route("/fetch-revision/:revisionId").get(fetchRevisionByIdHandler);
router.route("/fetch-all-revisions").get(fetchAllRevisionsHandler);

export default router;
