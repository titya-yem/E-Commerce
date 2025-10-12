import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Request, Response, NextFunction } from "express";
import Service from "../../src/models/service.model";

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

describe ("Service API", () => {
    let serviceId: string | undefined

    beforeAll(async () => {
        const createdService = await Service.create({
            title: "test service",
            description: "test description",
            image: "https://example.com/image1.jpg",
            alt: "image alt",
            price: 28,
            duration: 1
        }) as typeof Service.prototype

        serviceId = createdService._id.toString()
    })

    it('should get all services', async () => {
        const res = await request(app).get("/api/service")

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    });

    it('should create a new service', async () => {
        const res = await request(app)
        .post("/api/service/create")
        .send({
            title: "test service2",
            description: "test description2",
            image: "https://example.com/image2.jpg",
            alt: "image alt2",
            price: 18,
            duration: 2
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("_id")
        expect(res.body).toHaveProperty("title", "test service2")
    });

    it('should update service by ID', async () => {
        const res = await request(app)
        .put(`/api/service/${serviceId}`)
        .send({
            title: "test service3",
            description: "test description3",
            image: "https://example.com/image3.jpg",
            alt: "image alt2",
            price: 8,
            duration: 3
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("title", "test service3")
        expect(res.body).toHaveProperty("description", "test description3")
    });

    it('should delete services by Id', async () => {
        const res = await request(app).delete(`/api/service/${serviceId}`)

        expect(res.status).toBe(200)
        expect(res.body.message).toBe( "Service deleted successfully" )
    });

    it('should get services by user Id', async () => {
        const res = await request(app).get("/api/service/users")

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    });
})