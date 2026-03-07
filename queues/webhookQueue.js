import { Queue } from "bullmq";
import connection from "./connection.js";

const webhookQueue = new Queue("webhook-delivery", { connection });

export default webhookQueue;
