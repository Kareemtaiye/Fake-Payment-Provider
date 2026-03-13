import pool from "../config/db.js";

export default class WebhookDeliveryRepository {
  static async createWebhookDelivery(
    { paymentId, merchantId, eventId, responseStatus, attemptNumber, deliveredAt },
    db = pool,
  ) {
    const query = `
    INSERT INTO webhook_deliveries 
    (payment_id, merchant_id, event_id, response_status, attempt_number, delivered_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await db.query(query, [
      paymentId,
      merchantId,
      eventId,
      responseStatus,
      attemptNumber,
      deliveredAt,
    ]);
  }
}
