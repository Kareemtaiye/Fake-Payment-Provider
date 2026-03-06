import pool from "../config/db.js";
import PaymentRepository from "../repositories/paymentRepository.js";
import PaymentUtils from "../utilities/paymentUtils.js";
import EventService from "./eventService.js";
import IdempotencyKeyService from "./idempotencyKeyService.js";

export default class PaymentService {
  static async createPayment({
    merchantId,
    amount,
    metadata,
    method = "CARD",
    key,
    requestHash,
  }) {
    const client = await pool.connect();
    const reference = PaymentUtils.generateReference();

    try {
      await client.query("BEGIN");

      const payment = await PaymentRepository.createPayment(
        { merchantId, reference, amount, metadata, method },
        client,
      );

      await EventService.createEvent(
        { paymentId: payment.id, eventType: "payment.initialized", payload: payment },
        client,
      );

      await IdempotencyKeyService.createIdempotencyEntry(
        { merchantId, paymentId: payment.id, key, requestHash },
        client,
      );

      await client.query("COMMIT");

      return payment;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.release();
    }
  }

  static async getPaymentById(paymentId, client) {
    return await PaymentRepository.getPaymentById(paymentId, client);
  }

  static async getPaymentByReference(reference, client) {
    return await PaymentRepository.getPaymentByReference(reference, client);
  }
}
