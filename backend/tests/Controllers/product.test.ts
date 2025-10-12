import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Product from "../../src/models/product.model";

const mockUserId = new Types.ObjectId();

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

describe("Product API", () => {
    let productId: string;

    beforeAll(async () => {
        const createdProduct = await Product.create({
            name: "test product",
            category: "cat",
            price: 21,
            stock: 11,
            rating: 2,
            reviews: 1,
            description: "Good product",
            image: "https://example.com/image1.jpg",
        }) as typeof Product.prototype;

        productId = createdProduct._id.toString();
    });

    it('should get all products', async () => {
        const res = await request(app).get("/api/product");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get single product by ID', async () => {
        const res = await request(app).get(`/api/product/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "test product");
    });

    it('should create a new product', async () => {
        const res = await request(app)
        .post("/api/product/create")
        .send({
            name: "test product2",
            category: "cat",
            price: 11,
            stock: 21,
            rating: 4,
            reviews: 4,
            description: "Good product",
            image: "https://example.com/image2.jpg",
        })

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id")
        expect(res.body).toHaveProperty("name", "test product2");
    }); 

    it('should update product by ID', async () => {
        const res = await request(app)
        .put(`/api/product/${productId}`)
        .send({
           name: "updateed test product2",
            category: "dog",
            price: 11,
            stock: 21,
            rating: 4,
            reviews: 4,
            description: "Good product",
            image: "https://example.com/image2.jpg", 
        })

        expect(res.status).toBe(200);
        expect(res.body.category).toBe("dog")
        expect(res.body).toHaveProperty("name", "updateed test product2");
    });

    it('should delete product by ID', async () => {
        const res = await request(app).delete(`/api/product/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe( "Product deleted successfully" );
    });
});