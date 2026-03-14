import MerchantService from "../services/merchantService.js";
import AppError from "../utilities/AppError.js";

export default class ApiKeyAuth {
  static async verify(req, res, next) {
    let apiKey;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      apiKey = req.headers.authorization.split(" ")[1];
    }

    if (!apiKey) {
      return next(new AppError("Missing api key in the authorization header.", 401));
    }

    const merchant = await MerchantService.getMerchantByApiKey(apiKey);

    if (!merchant) {
      return next(new AppError("Invalid Api Key", 401));
    }

    req.merchant = merchant;
    next();
  }
}
