import MerchantRepository from "../repositories/merchantRepository.js";
import { generateApiKey } from "../utilities/generateKey.js";
import WebhookUtils from "../utilities/webhookUtils.js";

export default class MerchantService {
  static async registerMerchant({ name, webhookUrl }) {
    const apiKey = generateApiKey();
    const webhookSecret = WebhookUtils.generateWebhookSecret();

    return await MerchantRepository.registerMerchant({
      name,
      apiKey,
      webhookUrl,
      webhookSecret,
    });
  }

  static async getMerchantByApiKey(apiKey, client) {
    return await MerchantRepository.getMerchantByApiKey(apiKey, client);
  }

  static async getMerchantId(merchantId, client) {
    return await MerchantRepository.getMerchantById(merchantId, client);
  }
}
