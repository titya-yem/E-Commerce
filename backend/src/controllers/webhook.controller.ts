import { Request, Response } from "express";
import Order from "../models/order.model";
import stripe from "../utils/stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handleWebhook = async (req: Request, res: Response): Promise<void | any> => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send("Webhook Error: Invalid signature");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    await Order.findOneAndUpdate(
      { paymentIntentId: session.id },
      {
        isPaid: true,
        paidAt: new Date(),
        status: "Paid",
        receiptUrl: session.receipt_url,
      },
      { new: true }
    );
  }

  res.status(200).json({ received: true });
};