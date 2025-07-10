import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../error/error";
import pageViewService from "../service/page-view.service";

const trackPageView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.body;
    if (!articleId) {
      throw new errorResponse("articleId is required", 400);
    }

    await pageViewService.trackView(articleId);
    res.status(201).json({ message: "Page view recorded" });
  } catch (err) {
    next(err);
  }
};

const countPageViews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { article, startAt, endAt } = req.query;

    const count = await pageViewService.countViews(
      article?.toString(),
      startAt?.toString(),
      endAt?.toString()
    );

    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};

const aggregatePageViews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { interval = "daily", article, startAt, endAt } = req.query;

    if (!["hourly", "daily", "monthly"].includes(interval.toString())) {
      throw new errorResponse("invalid interval format", 400);
    }

    const data = await pageViewService.aggregateViews(
      interval as "hourly" | "daily" | "monthly",
      article?.toString(),
      startAt?.toString(),
      endAt?.toString()
    );

    res.status(200).json({ interval, data });
  } catch (err) {
    next(err);
  }
};

export default {
  trackPageView,
  countPageViews,
  aggregatePageViews,
};
