import IdempotencyKeyRepository from "../repositories/idempotencyKeyRepository.js";

export default class IdempotencyKeyService {
  static async getIdempotencykey({ key, merchantId }, client) {
    return await IdempotencyKeyRepository.getIdempotencyKey({ key, merchantId }, client);
  }

  static async createIdempotencyEntry(
    { merchantId, key, paymentId, requestHash },
    client,
  ) {
    return await IdempotencyKeyRepository.createIdempotencyEntry(
      { merchantId, key, paymentId, requestHash },
      client,
    );
  }
}
