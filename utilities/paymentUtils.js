import crypto from "crypto";

export default class PaymentUtils {
  static generateAuthorizationUrl(reference) {
    return `https://fake-provider.com/pay/${reference}`;
  }

  static generateReference() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const millisec = d.getMilliseconds();

    const formattedDate = `${year}${month}${day}${millisec}`;
    return `PAY_${formattedDate}_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  }
}
