import { Worker } from "bullmq";
import connection from "../queues/connection.js";
import WebhookDeliveryService from "../services/webhookDeliveryService.js";

const worker = new Worker(
  "webhook-delivery",
  async job => {
    const { eventId } = job.data;
    await WebhookDeliveryService.sendWebhook(eventId, job);
  },
  { connection },
);

worker.on("completed", job => {
  console.log("Webhook delivered", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Webhook failed", job.id, err);
});
