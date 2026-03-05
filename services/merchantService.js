import MerchantRepository from "../repositories/merchantRepository.js";
import { generateApiKey } from "../utilities/generateKey.js";
import signWebhookSecret from "../utilities/signWebhook.js";

export default class MerchantService {
  static async registerMerchant({ name, webhookUrl }) {
    const apiKey = generateApiKey();
    const webhookSecret = signWebhookSecret();

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
    return await MerchantRepository.getMerchantById(apiKey, client);
  }
}
