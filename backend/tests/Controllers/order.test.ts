import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Request, Response, NextFunction } from "express";
import Order from "../../src/models/order.model";
import mongoose from "mongoose";

// Use string for mockUserId to avoid ObjectId mismatch
const mockUserId = new mongoose.Types.ObjectId().toString();

// Mock the auth middleware to simulate a logged-in user
vi.mock("../../src/middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: mockUserId, role: "user" };
    next();
  },
  AuthRequest: {},
}));

// Mock the admin middleware (always allows)
vi.mock("../../src/middlewares/admin.middleware", () => ({
  __esModule: true,
  default: (req: Request, res: Response, next: NextFunction) => next(),
}));

describe("Order API", () => {
    let orderId: string | undefined;
    // create fake data for testing
    beforeAll (async () => {
        await Order.create({
        user: new mongoose.Types.ObjectId(mockUserId),
        items: [
            {
            id: "P001",
            name: "Pa Eau de Parfum",
            category: "Perfume",
            price: 120,
            quantity: 1,
            image: "image1",
            },
            {
            id: "P002",
            name: "Pa Mini Perfume (10ml)",
            category: "Perfume",
            price: 35,
            quantity: 2,
            image: "image2",
            },
        ],
        totalAmount: 190,
        totalQuantity: 3,
        status: "Pending",
        date: new Date(),
        isPaid: false,
        paidAt: null,
        paymentIntentId: null,
        receiptUrl: null,
        })
    })

    it('should fetch user orders', async () => {
        const res = await request(app).get("/api/order/me")
    
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)

        orderId = res.body[0]._id
        expect(orderId).toBeDefined()
    });

    it("should return 403 if the user tries to access another user’s order", async () => {
    const otherUserId = new mongoose.Types.ObjectId();
    const order = await Order.create({
      user: otherUserId,
      items: [
        {
          id: "P002",
          name: "Another Perfume",
          category: "Perfume",
          price: 100,
          quantity: 1,
          image: "image2",
        },
      ],
      totalAmount: 100,
      totalQuantity: 1,
      status: "Pending",
      date: new Date(),
      isPaid: false,
    });

    const res = await request(app).get(`/api/order/${order.id}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to get order");
  });

  it("should return 404 if order not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/order/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });

  it('should update order status (admin)', async () => {
    const res = await request(app)
    .patch(`/api/order/${orderId}/status`)
    .send({ status: "Shipped" }); 

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Status updated")
    expect(res.body.order.status).toBe("Shipped");
  })

  it('should delete order', async () => {
    const res = await request(app)
    .delete(`/api/order/${orderId}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Order deleted successfully")
  })
})