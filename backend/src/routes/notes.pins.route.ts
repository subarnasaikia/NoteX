import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    createPin,
    deletePin,
    getAllPins,
} from "../controllers/notes.pins.controller.js";

const router: Router = Router();
router.use(verfiyJWT);
router.route("/add-pin").post(createPin);
router.route("/delete-pin").delete(deletePin);
router.route("/fetch-pins").get(getAllPins);

export default router;
