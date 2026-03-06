# Mini Payment Processor (Event-Driven)

A **self-contained, event-driven payment processor** that simulates real-world payment flows. Designed for **learning, testing, and prototyping fintech applications**, this project mimics production systems like Stripe or Paystack with **merchant management, payment lifecycles, webhooks, idempotency, and asynchronous processing**.

---

## Features

- **Merchant Management**: Unique API keys, webhook URLs, and authentication.
- **Payment Lifecycle**: Initialize, track, and process payments with statuses (`PENDING`, `SUCCESS`, `FAILED`).
- **Event-Driven Architecture**: Background workers handle payment events asynchronously for reliability.
- **Webhook Simulation**: Send payment events to merchants, supporting retries and idempotency.
- **Idempotency Protection**: Prevent duplicate payments from repeated API requests.
- **Extensible Metadata**: Store additional payment information as JSONB.
- **Simulated Checkout**: Generate payment URLs for testing customer flows.

---

## Architecture Overview

```
Customer
   ↓
Merchant App
   ↓
Mini Payment Provider (this project)
   ↓
Event Queue & Worker
   ↓
Webhook Delivery / Ledger Integration
```

**Flow:**

1. Merchant initializes a payment via API.
2. Payment is stored with status `PENDING`.
3. Customer “pays” (simulated) using the authorization URL.
4. Webhook events are stored and processed asynchronously.
5. Worker updates payment status (`SUCCESS` / `FAILED`) and triggers ledger actions.

---

## Why This Project Is Valuable

- Simulates **real production payment processors**.
- Teaches **event-driven architecture, reliability, and async processing**.
- Perfect for backend engineers to **learn fintech patterns without real bank integration**.
- Easily extended to **simulate banks, multiple providers, refunds, and transfers**.
