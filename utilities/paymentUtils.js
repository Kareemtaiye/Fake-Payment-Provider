import crypto from "crypto";

export default class PaymentUtils {
  static generateAuthorizationUrl(reference) {
    return `https://pay.fake-provider.com/pay/${reference}`;
  }

  static generateReference() {
    return crypto.randomBytes(24).toString("hex");
  }
}
