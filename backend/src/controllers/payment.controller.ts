import { Request, Response } from "express";
import Order from "../models/order.model";
import stripe from "../utils/stripe";
import { checkoutValidation } from "../validations/checkout.validation";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Create Stripe Checkout Session
export const createCheckoutSession = async (req: CustomRequest, res: Response): Promise<void | any> => {
  const { error } = checkoutValidation.validate(req.body, { abortEarly: false });
  
  console.log("Request body:", req.body);
  console.log("User:", req.user);

  if (error) {
    return res.status(400).json({ message: error.details.map((d) => d.message).join(", ") });
  }

  const { cart, totalAmount, totalQuantity } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { 
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URI}/success`,
      cancel_url: `${process.env.CLIENT_URI}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user.id.toString(),
      },
    });

    await Order.create({
      user: user.id,
      items: cart,
      totalAmount,
      totalQuantity,
      status: "Pending",
      isPaid: false,
      paymentIntentId: session.payment_intent as string,
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};