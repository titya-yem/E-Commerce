import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi, afterEach } from "vitest";
import mongoose from "mongoose";
import Order from "../../src/models/order.model";
import { Request, Response, NextFunction } from "express";

// Mock Auth Middleware
const mockUser = {
  id: new mongoose.Types.ObjectId().toString(),
  email: "user@example.com",
  role: "user",
};

vi.mock("../../src/middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (_req: Request, _res: Response, next: NextFunction) => {
    (_req as any).user = mockUser;
    next();
  },
}));

// Mock Stripe
vi.mock("../../src/utils/stripe", () => ({
  __esModule: true,
  default: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "sess_123",
          url: "https://checkout.stripe.com/pay/sess_123",
          payment_intent: "pi_123",
        }),
      },
    },
  },
}));

// Cleanup after each test
afterEach(async () => {
  await Order.deleteMany({});
});

describe("POST /api/payment/create-checkout-session", () => {
  it("should create a Stripe checkout session and save an order", async () => {
    const cart = [
      {
        id: "P001",
        name: "Pa Eau de Parfum",
        category: "Perfume",
        price: 120,
        quantity: 1,
        image: "https://example.com/image1.jpg",
      },
    ];

    const res = await request(app)
      .post("/api/payment/create-checkout-session")
      .send({ cart, totalAmount: 120, totalQuantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.sessionUrl).toBe("https://checkout.stripe.com/pay/sess_123");

    const order = await Order.findOne({ user: mockUser.id });
    expect(order).toBeDefined();
    expect(order?.totalAmount).toBe(120);
    expect(order?.totalQuantity).toBe(1);
    expect(order?.status).toBe("Pending");
    expect(order?.isPaid).toBe(false);
    expect(order?.paymentIntentId).toBe("pi_123");
  });

  it("should return 400 if validation fails", async () => {
    const res = await request(app)
      .post("/api/payment/create-checkout-session")
      .send({
        cart: [{ id: "P001" }],
        totalAmount: 120,
        totalQuantity: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("is required");
  });
});