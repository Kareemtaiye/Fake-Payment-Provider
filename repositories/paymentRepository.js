import pool from "../config/db.js";

export default class PaymentRepository {
  static async createPayment(
    { merchantId, reference, amount, metadata, method },
    db = pool,
  ) {
    const query = `
    INSERT INTO transactions 
    (merchant_id, reference, amount, metadata, method)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING status, reference
    `;

    const { rows } = await db.query(query, [
      merchantId,
      reference,
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
}
