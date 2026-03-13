import pool from "../config/db.js";

export default class IdempotencyKeyRepository {
  static async createIdempotencyEntry(
    { merchantId, key, paymentId, requestHash },
    db = pool,
  ) {
    const query = `
    INSERT INTO idempotency_keys
    (merchant_id, payment_id, key, request_hash)
    VALUES ($1, $2, $3, $4)
     ON CONFLICT (key, merchant_id) DO NOTHING
    RETURNING *; 
    `;

    const { rows } = await db.query(query, [merchantId, paymentId, key, requestHash]);
    return rows[0];
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
