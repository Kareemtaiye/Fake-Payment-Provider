export default class TransactionRepository {
  static async createTransaction(
    { merchantId, reference, amount, type, idempotencyKey, metadata },
    db = pool,
  ) {
    const query = `
    INSERT INTO transactions 
    (merchant_id, reference, amount, type, idempotency_key, metadata)
    VALUES ($1, $2, $3, $4, $5, %6)
    RETURNING *
    `;

    const { rows } = await db.query(query, [
      merchantId,
      reference,
      amount,
      type,
      idempotencyKey,
      metadata,
    ]);

    return rows[0] || null;
  }
}
