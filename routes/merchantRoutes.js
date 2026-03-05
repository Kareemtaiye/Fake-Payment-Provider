import { Router } from "express";
import MerchantController from "../controllers/merchantController.js";
import asyncErrHandler from "../utilities/asyncErrHandler.js";

const router = Router();
router.post("/register", asyncErrHandler(MerchantController.register));

export default router;
