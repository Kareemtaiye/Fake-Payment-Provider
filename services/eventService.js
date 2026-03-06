import EventRepository from "../repositories/eventRepository.js";

export default class EventService {
  static async createEvent({ paymentId, eventType, payload }, client) {
    return await EventRepository.createEvent({ paymentId, eventType, payload }, client);
  }

  static async getEventByPaymentId(paymentId, client) {
    return await EventRepository.getEvenByPaymentId(paymentId, client);
  }
}
