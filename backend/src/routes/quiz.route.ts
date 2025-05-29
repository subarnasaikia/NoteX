import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import {
    generateQuizHandler,
    fetchQuizzesHandler,
    fetchQuizByIdHandler,
    fetchAllQuizHandler,
    submitQuizHandler,
    fetchResultsHandler,
} from "../controllers/quiz.controller.js";

const router: Router = Router();
router.use(verfiyJWT);
router.route("/generate-quiz").post(generateQuizHandler);
router.route("/fetch-quizzes/page/:page/limit/:limit").get(fetchQuizzesHandler);
router.route("/fetch-quiz/:quizId").get(fetchQuizByIdHandler);
router.route("/fetch-all-quizzes").get(fetchAllQuizHandler);
router.route("/submit-quiz").post(submitQuizHandler);
router.route("/fetch-results/:quizId").get(fetchResultsHandler);

export default router;
