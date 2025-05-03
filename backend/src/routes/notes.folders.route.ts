import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    createFolder,
    fetchFolders,
    deleteFolder,
    updateFolder,
    fetchFoldersWithPagination,
} from "../controllers/notes.folders.controller.js";

const router: Router = Router();

router.use(verfiyJWT);
router.route("/create-folder").post(createFolder);
router.route("/fetch-folders").get(fetchFolders);
router.route("/update-folder/:folderId").patch(updateFolder);
router.route("/delete-folder/:folderId").delete(deleteFolder);
router.route("/fetch-folders/:page/:limit").get(fetchFoldersWithPagination);

export default router;
