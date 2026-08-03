import Router from "express";
import healthRouter from "./health.routes";
import accountRouter from "./account.routes";

const router = Router();

router.use("/health", healthRouter);

router.use("/account", accountRouter);

export default router;
