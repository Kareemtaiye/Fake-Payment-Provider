import { Router } from "express";
import asyncErrHandler from "../utilities/asyncErrHandler.js";
import ApiKeyAuth from "../middlewares/apiKeyAuth.js";
import PaymentController from "../controllers/paymentController.js";

const router = Router();
router.use(ApiKeyAuth.verify);

router.post("/initialize", asyncErrHandler(PaymentController.initiatePaymentTransaction));

export default router;
