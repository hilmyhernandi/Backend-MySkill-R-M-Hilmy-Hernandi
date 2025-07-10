import { articleModel } from "../module/article.module";
import { IArticle } from "../interfaces/module/article-module.interface";

const createArticle = async (
  title: string,
  content: string,
  status: "draft" | "published",
  author: string
): Promise<IArticle> => {
  const article = new articleModel({
    title,
    content,
    status,
    author,
  });
  return await article.save();
};

const findPublishedArticles = async () => {
  return await articleModel.find({ status: "published" });
};

const findDraftArticlesByUser = async (usersId: string) => {
  return await articleModel.find({ author: usersId, status: "draft" });
};

const updateArticle = async (
  id: string,
  usersId: string,
  data: Partial<IArticle>
) => {
  return await articleModel.findOneAndUpdate(
    { _id: id, author: usersId },
    data,
    {
      new: true,
    }
  );
};

const deleteArticle = async (id: string, usersId: string) => {
  return await articleModel.findOneAndDelete({ _id: id, author: usersId });
};

const findAuthorById = async (id: string): Promise<string | null> => {
  const article = await articleModel.findById(id).select("author");

  return article ? article.author.toString() : null;
};

const articleWithTitle = async (title: string): Promise<boolean> => {
  const existingArticle = await articleModel.exists({ title });
  return !!existingArticle;
};

const updateStatus = async (id: string, status: string) => {
  const updatedArticle = await articleModel.findByIdAndUpdate(
    id,
    { status, updatedAt: new Date() },
    { new: true }
  );

  return updatedArticle;
};

export default {
  createArticle,
  findPublishedArticles,
  findDraftArticlesByUser,
  updateArticle,
  deleteArticle,
  findAuthorById,
  articleWithTitle,
  updateStatus,
};
