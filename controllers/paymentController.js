import crypto from "crypto";
import IdempotencyKeyService from "../services/idempotencyKeyService.js";
import AppError from "../utilities/AppError.js";
import PaymentRepository from "../repositories/paymentRepository.js";
import PaymentUtils from "../utilities/paymentUtils.js";
import PaymentService from "../services/paymentService.js";

export default class PaymentController {
  static async initiatePaymentTransaction(req, res, next) {
    const idempotencyKey = req.headers("Idempotency-Key");
    if (!idempotencyKey) {
      return next(new AppError("Missing Idempotency-Key header.", 400));
    }

    const { amount, currency, metadata } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError("Request body is required", 400));
    }

    if (!amount || !currency) {
      return next(
        new AppError("Missing amount, currency, and optional 'metadata' field", 400),
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
        .update(JSON.stringify({ amount, currency, metadata }))
        .digest("hex");

      //Confilct
      if (record.request_hash !== hashedPayload) {
        return next(new AppError("Idempotency key used with different payload.", 409));
      }

      const { reference, amount, currency, status, id } =
        await PaymentRepository.getPaymentByReference(record.payment_reference);

      //Wait up. Can only send auth url when the payment was pending(i.e payment was just initialize but hasnt been processed)

      //Send the one in the DB
      return res.status(200).json({
        status: "success",
        data: {
          reference,
          amount,
          currency,
          status,
          authorization_url:
            status === "PENDING"
              ? PaymentUtils.generateAuthorizationUrl(reference)
              : undefined, // no need to resend if worker has updated it to some other status
        },
      });
    }

    //If idempotency key doesn't exist, we insert a new row.
    //But first, race condition check. check the query for inserting idempotency(for possible future collab)
    const newPaymentRow = await PaymentService.createPayment();
  }
}
