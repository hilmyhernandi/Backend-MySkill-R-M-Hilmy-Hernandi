import { pageViewModel } from "../module/page-view.module";
import { FilterQuery, Types } from "mongoose";
import { IPageView } from "../interfaces/module/page-view-module.interface";

const trackView = async (articleId: string) => {
  return await pageViewModel.create({ article: articleId });
};

const countViews = async (
  articleId?: string,
  startAt?: string,
  endAt?: string
) => {
  const query: FilterQuery<IPageView> = {};

  if (articleId) query.article = new Types.ObjectId(articleId);
  if (startAt || endAt) {
    query.viewedAt = {};
    if (startAt) query.viewedAt.$gte = new Date(startAt);
    if (endAt) query.viewedAt.$lte = new Date(endAt);
  }

  return await pageViewModel.countDocuments(query);
};

const aggregateViews = async (
  interval: "hourly" | "daily" | "monthly",
  articleId?: string,
  startAt?: string,
  endAt?: string
) => {
  const match: FilterQuery<IPageView> = {};

  if (articleId) match.article = new Types.ObjectId(articleId);
  if (startAt || endAt) {
    match.viewedAt = {};
    if (startAt) match.viewedAt.$gte = new Date(startAt);
    if (endAt) match.viewedAt.$lte = new Date(endAt);
  }

  const dateFormat =
    interval === "hourly"
      ? { $dateToString: { format: "%Y-%m-%d %H:00", date: "$viewedAt" } }
      : interval === "daily"
      ? { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } }
      : { $dateToString: { format: "%Y-%m", date: "$viewedAt" } };

  return await pageViewModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: dateFormat,
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export default {
  trackView,
  countViews,
  aggregateViews,
};
