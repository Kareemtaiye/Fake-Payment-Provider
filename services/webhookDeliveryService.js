import EventRepository from "../repositories/eventRepository.js";
import WebhookDeliveryRepository from "../repositories/webhookDeliveryRepository.js";
import WebhookUtils from "../utilities/webhookUtils.js";
import EventService from "./eventService.js";
import MerchantService from "./merchantService.js";

export default class WebhookDeliveryService {
  static async sendWebhook(eventId, job) {
    const event = await EventRepository.getEvenById(eventId);
    const merchant = await MerchantService.getMerchantId(event.merchant_id);

    //event already processed.
    if (event.processed) {
      return;
    }

    // No merchant
    if (!merchant.webhook_url) {
      return;
    }

    const payload = JSON.stringify({
      event: event.event_type,
      data: event.payload,
    });

    //Webhook sig for verification on the merchant side
    const signature = WebhookUtils.createWebhookSignature(
      merchant.webhook_secret,
      payload,
    );

    //Send webhook to merchant url
    const response = await fetch(merchant.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-provider-signature": signature,
      },
      body: JSON.stringify({
        event: event.event_type,
        data: event.payload,
      }),
    });

    console.log("Reponse from event webhook: ", response);
    console.log("Reponse from event webhook: ", response.ok);

    //trigger retires
    // if (!response.ok) {
    //   throw new Error("Webhook delivery failed");
    // }

    // const response = {
    //   ok: true,
    // };

    //Create an entry for the webhook
    await WebhookDeliveryRepository.createWebhookDelivery({
      paymentId: event.payment_id,
      merchantId: merchant.id,
      eventId: event.id,
      // responseStatus: response?.status,
      attemptNumber: job.attemptsMade + 1,
      deliveredAt: response.ok ? new Date(Date.now()) : null,
    });

    //After successful delivery, we should mark the event as delivered(processed)
    await EventService.markEventAsProcessed(event.id);
  }
}
