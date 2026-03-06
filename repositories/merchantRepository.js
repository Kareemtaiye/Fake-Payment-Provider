import pool from "../config/db.js";

export default class MerchantRepository {
  static async registerMerchant({ name, apiKey, webhookUrl, webhookSecret }, db = pool) {
    const query = `
    INSERT INTO merchants 
    (name, api_key, webhook_url, webhook_secret) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, api_key, webhook_secret`;

    const { rows } = await db.query(query, [name, apiKey, webhookUrl, webhookSecret]);
    return rows[0];
  }

  static async getMerchantByApiKey(apiKey, db = pool) {
    const query = `
    SELECT * FROM merchants 
    WHERE api_key = $1
    `;

    const { rows } = await db.query(query, [apiKey]);
    return rows[0] || null;
  }

  static async getMerchantById(merchantId, db = pool) {
    const query = `
    SELECT * FROM merchants 
    WHERE id = $1
    `;

    const { rows } = await db.query(query, merchantId);
    return rows[0] || null;
  }
}
