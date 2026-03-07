import crypto from "crypto";

export function generateApiKey() {
  return "fp_test_" + crypto.randomBytes(24).toString("hex");
}

console.log(crypto.randomBytes(10).toString("hex"));
