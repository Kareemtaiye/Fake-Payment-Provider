import pool from "../config/db.js";

export default class EventRepository {
  static async createEvent({ paymentId, merchantId, eventType, payload }, db = pool) {
    const query = `
        INSERT INTO events (payment_id, merchant_id, event_type, payload)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;

    const { rows } = await db.query(query, [paymentId, merchantId, eventType, payload]);
    return rows[0];
  }

  static async getEvenById(id, db = pool) {
    const query = `
    SELECT * FROM events WHERE id = $1
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async getEvenByPaymentId(paymentId, db = pool) {
    const query = `
    SELECT * FROM events WHERE payment_id = $1
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [paymentId]);
    return rows[0] || null;
  }

  static async markEventAsProcessed(eventId, db = pool) {
    const query = `
    UPDATE events SET processed = TRUE 
    WHERE id = $1
    `;

    await db.query(query, [eventId]);
  }
}
