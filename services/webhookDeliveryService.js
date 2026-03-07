import EventRepository from "../repositories/eventRepository.js";
import WebhookDeliveryRepository from "../repositories/webhookDeliveryRepository.js";
import MerchantService from "./merchantService.js";

export default class WebhookDeliveryService {
  static async sendWebhook(eventId) {
    const event = await EventRepository.getEvenById(eventId);
    const merchant = await MerchantService.getMerchantId(event.merchant_id);

    //No merchant
    if (!merchant.webhook_url) return;

    //Send webhook to merchant url
    const response = await fetch(merchant.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event.event_type,
        data: event.payload,
      }),
    });

    console.log("Reponse from event webhook: ", response);

    //Create an entry for the webhook
    await WebhookDeliveryRepository.createWebhookDelivery({
      paymentId: event.payment_id,
      merchantId: merchant.id,
      eventId: event.id,
      responseStatus: response.status,
    });
  }
}
