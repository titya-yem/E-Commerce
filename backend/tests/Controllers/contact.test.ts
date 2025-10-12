import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";

// Use string for mockUserId to avoid ObjectId mismatch
const mockUserId = "66f0f0f0f0f0f0f0f0f0f0f0";

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

describe("Contact API", () => {
    it('should create a new comment', async () => {
        const res = await request(app)
        .post("/api/contact/create")
        .send({
            firstName: "first test",
            lastName: "last test",
            email: "test@gmail.com",
            phoneNumber: "123456789",
            message: "test messasge"
        })

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.firstName).toBe("first test");
    })

    it('should fetch all contacts for admin', async () => {
        const res = await request(app).get("/api/contact")

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})