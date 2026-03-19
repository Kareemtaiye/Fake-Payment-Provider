import pool from "../config/db.js";

export default class PaymentRepository {
  static async createPayment(
    { merchantId, reference, merchantRef, amount, metadata, method },
    db = pool,
  ) {
    const query = `
    INSERT INTO payments 
    (merchant_id, reference, merchant_reference, amount, metadata, method)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, reference, merchant_reference, amount, currency, status
    `;

    const { rows } = await db.query(query, [
      merchantId,
      reference,
      merchantRef,
      amount,
      metadata,
      method,
    ]);

    return rows[0] || null;
  }

  static async getPaymentById(paymentId, db = pool) {
    const query = `
    SELECT * FROM payments WHERE id = $1
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [paymentId]);
    return rows[0] || null;
  }

  static async getPaymentByReference(reference, db = pool) {
    const query = `
    SELECT * FROM payments WHERE reference = $1
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [reference]);
    return rows[0] || null;
  }

  static async updatePaymentStatus({ reference, status }, db = pool) {
    const query = `
    UPDATE payments 
    SET status = $1, updated_at = now()
    WHERE reference = $2
    RETURNING id, reference, merchant_reference, amount, currency, status
    `;

    const { rows } = await db.query(query, [status, reference]);

    return rows[0] || null;
  }
}
