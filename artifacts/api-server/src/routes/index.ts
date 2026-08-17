import { Router, type IRouter } from "express";
import healthRouter from "./health";
import attendeesRouter from "./attendees";
import storiesRouter from "./stories";
import intelligenceRouter from "./intelligence";

const router: IRouter = Router();

router.use(healthRouter);
router.use(attendeesRouter);
router.use(storiesRouter);
router.use(intelligenceRouter);

export default router;
