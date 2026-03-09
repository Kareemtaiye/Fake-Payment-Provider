import crypto from "crypto";

export default class WebhookUtils {
  static generateWebhookSecret() {
    return "whsec_" + crypto.randomBytes(24).toString("hex");
  }

  static createWebhookSignature(secret, payload) {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
  }
}
