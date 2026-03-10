import crypto from "crypto";
import IdempotencyKeyService from "../services/idempotencyKeyService.js";
import AppError from "../utilities/AppError.js";
import PaymentRepository from "../repositories/paymentRepository.js";
import PaymentUtils from "../utilities/paymentUtils.js";
import PaymentService from "../services/paymentService.js";
import { urlencoded } from "express";

export default class PaymentController {
  static async initiatePaymentTransaction(req, res, next) {
    const idempotencyKey = req.headers["idempotency-key"];

    if (!idempotencyKey) {
      return next(new AppError("Missing Idempotency-Key header.", 400));
    }
    const { amount, currency, metadata, merchant_ref } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError("Request body is required", 400));
    }

    if (!amount || !currency) {
      return next(
        new AppError(
          "Missing one or all of amount, currency, and optional ['metadata', 'merchant_ref'] field(s)",
          400,
        ),
      );
    }

    //Check if idempotency key already exists
    const record = await IdempotencyKeyService.getIdempotencykey({
      key: idempotencyKey,
      merchantId: req.merchant.id,
    });

    //To get the event type.
    let event;

    if (record) {
      //Check if it is the same payload.
      const hashedPayload = crypto
        .createHash("sha256")
        .update(JSON.stringify({ amount, currency }))
        .digest("hex");

      //Confilct
      if (record.request_hash !== hashedPayload) {
        return next(new AppError("Idempotency key used with different payload.", 409));
      }

      const payment = await PaymentRepository.getPaymentById(record.payment_id);

      //Wait up. Can only send auth url when the payment was pending(i.e payment was just initialize but hasnt been processed)

      //Send the one in the DB
      return res.status(200).json({
        status: "success",
        data: {
          reference: payment.reference,
          merchant_reference: payment.merchant_ref,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          authorization_url:
            payment.status === "PENDING"
              ? PaymentUtils.generateAuthorizationUrl(payment.reference)
              : undefined, // no need to resend if worker has updated it to some other status
        },
      });
    }

    //If idempotency key doesn't exist, we insert a new row.
    //But first, race condition check. check the query for inserting idempotency(for possible future collab)

    const requestHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ amount, currency }))
      .digest("hex");

    const newPayment = await PaymentService.createPayment({
      merchantId: req.merchant.id,
      merchantRef: merchant_ref,
      amount,
      metadata: JSON.stringify(metadata),
      key: idempotencyKey,
      requestHash,
    });

    res.status(201).json({
      status: "success",
      data: {
        ...newPayment,
        authorization_url: PaymentUtils.generateAuthorizationUrl(newPayment.reference),
      },
    });
  }

  static async loadPaymentPage(req, res, next) {
    const ref = req.params.reference;

    if (!ref) {
      return next(new AppError("Missing reference parameter.", 400));
    }

    const payment = await PaymentService.getPaymentByReference(ref);

    if (!payment) {
      return next(new AppError("Payment not found for reference.", 404));
    }

    //Check if payment has not been already processed
    if (payment.status !== "PENDING") {
      return next(new AppError("Payment already processed", 400));
    }

    //Go ahead and pay
    res.status(200).json({
      status: "success",
      data: {
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        message: "Please select payment method",
        metadata: payment.metadata,
      },
    });
    //LATER WHEN WE BUILD FRONTEND, THIS ENDPOINT WILL RETURN HTML INSTEAD OF JSON
  }

  static async processPayment(req, res, next) {
    const ref = req.params.reference;

    if (!ref) {
      return next(new AppError("Missing reference parameter.", 400));
    }

    const payment = await PaymentService.getPaymentByReference(ref);

    if (!payment) {
      return next(new AppError("Payment not found for reference.", 404));
    }

    //Check if payment has not been already processed
    if (payment.status !== "PENDING") {
      return next(new AppError("Payment already processed", 400));
    }

    //Simulate success or failure, for now
    const randomNum = Math.random();
    const success = randomNum > 0.2;

    console.log(randomNum);

    const newStatus = success ? "SUCCESS" : "FAILED";

    const updatedPayment = await PaymentService.updatePaymentStatus({
      reference: ref,
      status: newStatus,
    });

    if (!updatedPayment) {
      return next(
        new AppError("Failed to update payment status. Please try again later", 500),
      );
    }

    res.status(200).json({
      status: "success",
      message: "Payment processed",
      data: {
        reference: updatedPayment.reference,
        status: updatedPayment.status,
      },
    });
  }
}
