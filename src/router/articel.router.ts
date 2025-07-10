import { Router } from "express";
import articleController from "../controllers/article.controller";
import { jwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.get("/", articleController.getPublishedArticles);
router.get("/drafts", jwtMiddleware, articleController.getDraftArticlesByUser);
router.post("/", jwtMiddleware, articleController.createArticle);
router.put("/:id", jwtMiddleware, articleController.updateArticle);
router.patch("/:id/status", articleController.updateArticleStatus);
router.delete("/:id", jwtMiddleware, articleController.deleteArticle);

export default router;
