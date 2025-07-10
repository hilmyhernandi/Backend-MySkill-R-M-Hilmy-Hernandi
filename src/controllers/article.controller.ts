import { Request, Response, NextFunction } from "express";
import articleService from "../service/article.service";
import { articleSchema } from "../validations/article.validations";
import { getSessionUserId } from "../utils/session.util";
import { errorResponse } from "../error/error";

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = articleSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const author = getSessionUserId(req);
    const { title, content, status } = req.body;

    const titleExists = await articleService.articleWithTitle(title);
    if (titleExists) {
      throw new errorResponse(
        "title already exists, please use another title",
        409
      );
    }

    const article = await articleService.createArticle(
      title,
      content,
      status,
      author
    );
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

const getPublishedArticles = async (_req: Request, res: Response) => {
  const articles = await articleService.findPublishedArticles();
  res.json(articles);
};

const getDraftArticlesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getSessionUserId(req);
    const articles = await articleService.findDraftArticlesByUser(userId);
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = articleSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const id = req.params.id;
    const { title, content, status } = req.body;
    const userId = getSessionUserId(req);
    const authorId = await articleService.findAuthorById(id);
    if (authorId != userId) {
      throw new errorResponse(
        "title already exists, please use another title",
        409
      );
    }

    const data = { title, content, status };

    const article = await articleService.updateArticle(id, userId, data);

    if (!article)
      return res.status(403).json({ message: "Not authorized or not found" });

    res.json(article);
  } catch (err) {
    next(err);
  }
};

const updateArticleStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      throw new errorResponse("Invalid status value", 400);
    }

    const updated = await articleService.updateStatus(id, status);

    if (!updated) {
      throw new errorResponse("Article not found", 404);
    }

    return res.status(200).json({
      message: "Article status updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getSessionUserId(req);
    const result = await articleService.deleteArticle(req.params.id, userId);

    if (!result)
      return res.status(403).json({ message: "Not authorized or not found" });

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createArticle,
  getPublishedArticles,
  getDraftArticlesByUser,
  updateArticle,
  updateArticleStatus,
  deleteArticle,
};
