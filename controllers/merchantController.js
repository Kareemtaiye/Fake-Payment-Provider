import MerchantService from "../services/merchantService.js";
import AppError from "../utilities/AppError.js";

export default class MerchantController {
  static async register(req, res, next) {
    const { name, webhook_url } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0 || !name || !webhook_url) {
      return next(new AppError("Missing req body with name and webhook url.", 400));
    }

    const data = await MerchantService.registerMerchant({
      name,
      webhookUrl: webhook_url,
    });

    res.status(201).json({
      status: "success",
      data,
    });
  }
}
