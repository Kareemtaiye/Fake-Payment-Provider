import pool from "../config/db.js";

export default class EventRepository {
  static async createEvent({ paymentId, eventType, payload }, db = pool) {
    const query = `
        INSERT INTO events (payment_id, event_type, payload)
        VALUES ($1, $2, $3)
        RETURNING *
        `;

    const { rows } = await db.query(query, [paymentId, eventType, payload]);
    return rows[0];
  }

  static async getEvenByPaymentId(paymentId, db = pool) {
    const query = `
    SELECT * FROM events WHERE payment_id = $1
    FOR UPDATE
    `;

    const { rows } = await db.query(query, [paymentId]);
    return rows[0] || null;
  }
}
