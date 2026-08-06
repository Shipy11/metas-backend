import Router from "express";
import healthRouter from "./health.routes";
import accountRouter from "./account.routes";
import companyRouter from "./company.routes";

const router = Router();

router.use("/health", healthRouter);

router.use("/account", accountRouter);

router.use("/company", companyRouter);

export default router;
