import { Router } from "express";
import pageViewController from "../controllers/page-view.controller";
import { jwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", pageViewController.trackPageView);
router.get("/count", jwtMiddleware, pageViewController.countPageViews);
router.get(
  "/aggregate-date",
  jwtMiddleware,
  pageViewController.aggregatePageViews
);

export default router;
