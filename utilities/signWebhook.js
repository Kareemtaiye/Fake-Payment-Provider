import crypto from "crypto";

export default function signWebhookSecret() {
  return "whsec_" + crypto.randomBytes(24).toString("hex");
}
