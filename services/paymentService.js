import pool from "../config/db.js";
import webhookQueue from "../queues/webhookQueue.js";
import PaymentRepository from "../repositories/paymentRepository.js";
import PaymentUtils from "../utilities/paymentUtils.js";
import EventService from "./eventService.js";
import IdempotencyKeyService from "./idempotencyKeyService.js";

export default class PaymentService {
  static async createPayment({
    merchantId,
    merchantRef,
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

      const { id: paymentId, ...paymentData } = await PaymentRepository.createPayment(
        { merchantId, reference, amount, metadata, method, merchantRef },
        client,
      );

      const event = await EventService.createEvent(
        { paymentId, merchantId, eventType: "payment.initialized", payload: paymentData },
        client,
      );

      await IdempotencyKeyService.createIdempotencyEntry(
        { merchantId, paymentId: paymentId, key, requestHash },
        client,
      );

      await webhookQueue.add(
        "send-webhook",
        { eventId: event.id },
        {
          attempts: 5,
          backoff: { type: "exponential", delay: 10000 },
        },
      );

      await client.query("COMMIT");

      return paymentData;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.release();
    }
  }

  static async processPayment({ reference, status, merchantId }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const payment = await PaymentRepository.updatePaymentStatus(
        { reference, status },
        client,
      ); //Don't send id to client

      console.log(payment);

      if (!payment) {
        return null;
      }

      const { id, ...paymentData } = payment;

      const event = await EventService.createEvent(
        {
          paymentId: paymentData.id,
          eventType: status === "SUCCESS" ? "payment.success" : "payment.failed", //for now
          payload: paymentData,
          merchantId: merchantId,
        },
        client,
      );

      console.log(event, "Event created");

      await webhookQueue.add(
        "send-webhook",
        { eventId: event.id },
        {
          attempts: 5,
          backoff: { type: "exponential", delay: 10000 },
        },
      );

      await client.query("COMMIT");

      return paymentData;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.release();
    }
  }
  static async updatePaymentStatus({ reference, status }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const payment = await PaymentRepository.updatePaymentStatus(
        { reference, status },
        client,
      ); //Don't send id to client

      if (!payment) {
        return null;
      }

      const { id, ...paymentData } = payment;

      await EventService.createEvent(
        {
          paymentId: paymentData.id,
          eventType: status === "SUCCESS" ? "payment.success" : "payment.failed", //for now
          payload: paymentData,
        },
        client,
      );

      await client.query("COMMIT");

      return paymentData;
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
