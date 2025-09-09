import { Request, Response } from "express";
import Order, { orderStatus } from "../models/order.model";
import stripe from "../utils/stripe";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Find order by paymentIntentId
    const order = await Order.findOne({ paymentIntentId: session.payment_intent as string });
    if (!order) return res.status(404).send("Order not found");

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = orderStatus.Paid;
    // Optional: Stripe Checkout Session includes a receipt URL sometimes
    order.receiptUrl = (session.payment_status === "paid" ? session.url : "") || "";

    await order.save();
    console.log(`Order ${order._id} marked as paid`);
  }

  res.status(200).json({ received: true });
};
