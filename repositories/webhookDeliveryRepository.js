import pool from "../config/db.js";

export default class WebhookDeliveryRepository {
  static async createWebhookDelivery(
    { paymentId, merchantId, eventId, responseStatus },
    db = pool,
  ) {
    const query = `
    INSERT INTO webhook_deliveries (payment_id, merchant_id, event_id, response_status)
    `;

    await db.query(query, [paymentId, merchantId, eventId, responseStatus]);
  }
}
