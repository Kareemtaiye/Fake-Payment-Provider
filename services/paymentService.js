import PaymentRepository from "../repositories/paymentRepository.js";

export default class PaymentService {
  static async createPayment(
    { merchantId, reference, amount, metadata, method },
    client,
  ) {
    return await PaymentRepository.createPayment(
      { merchantId, reference, amount, metadata, method },
      client,
    );
  }

  static async getPaymentById(paymentId, client) {
    return await PaymentRepository.getPaymentById(paymentId, client);
  }

  static async getPaymentByReference(reference, client) {
    return await PaymentRepository.getPaymentByReference(reference, client);
  }
}
