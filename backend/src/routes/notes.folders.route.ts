import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    createFolder,
    fetchFolders,
    deleteFolder,
    updateFolder,
    fetchFoldersWithPagination,
    fetchContentsImagesFoldersInFolder,
    fetchContentsImagesFoldersForROOT,
} from "../controllers/notes.folders.controller.js";

const router: Router = Router();

router.use(verfiyJWT);
router.route("/create-folder").post(createFolder);
router.route("/fetch-folders").get(fetchFolders);
router.route("/update-folder/:folderId").patch(updateFolder);
router.route("/delete-folder/:folderId").delete(deleteFolder);
router
    .route("/fetch-folders/root/page/:page/limit/:limit")
    .get(fetchFoldersWithPagination);
router
    .route("/fetch-folder-contents/folderId/:folderId/page/:page/limit/:limit")
    .get(fetchContentsImagesFoldersInFolder);
router
    .route("/fetch-root-folder-contents")
    .get(fetchContentsImagesFoldersForROOT);
export default router;
