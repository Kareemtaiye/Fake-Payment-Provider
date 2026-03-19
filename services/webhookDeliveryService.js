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
      id: event.id,
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
        id: event.id,
        event: event.event_type,
        data: event.payload,
      }),
    });

    const responseData = await response.json().catch(() => null); // some endpoints return no body;
    console.log("Response from event webhook: ", responseData);

    //Create an entry for the webhook
    await WebhookDeliveryRepository.createWebhookDelivery({
      paymentId: event.payment_id,
      merchantId: merchant.id,
      eventId: event.id,
      responseStatus: response?.status,
      attemptNumber: job.attemptsMade + 1,
      deliveredAt: response.ok ? new Date(Date.now()) : null,
    });

    //After successful delivery, we should mark the event as delivered(processed)
    // Only mark as processed if delivery succeeded
    if (response.ok) {
      await EventService.markEventAsProcessed(event.id);
    }
  }
}
