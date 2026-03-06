import pool from "../config/db.js";

export default class IdempotencyKeyRepository {
  static async createIdempotencyEntry(
    { merchantId, key, responseBody, requestHash, statusCode },
    db = pool,
  ) {
    const query = `
    INSERT INTO idempotency_keys
    (merchant_id, key, response_body, request_hash, status_code)
    VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (idempotency_key, merchant_id) DO NOTHING
    RETURNING *; 
    `;

    const { rows } = await db.query(query, [
      merchantId,
      key,
      responseBody,
      requestHash,
      statusCode,
    ]);
    return rows[0] || null;
  }

  static async getIdempotencyKey({ key, merchantId }, db = pool) {
    const query = `
    SELECT * FROM idempotency_keys 
    WHERE key = $1 AND merchant_id = $2
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [key, merchantId]);
    return rows[0] || null;
  }
}
