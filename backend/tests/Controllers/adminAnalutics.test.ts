import { describe, it, beforeAll, vi, expect } from "vitest";
import { Request, Response, NextFunction } from "express";
import request from "supertest";
import app from "../../src/index";

// Mock controller responses
vi.mock("../../src/controllers/adminAnalytics.controller", () => ({
  getSalesPerMonth: vi.fn((req, res) =>
    res.json([
      { month: "Jan", totalSales: 100 },
      { month: "Feb", totalSales: 200 },
    ])
  ),
  getOrdersPerMonth: vi.fn((req, res) =>
    res.json([
      { month: "Jan", totalOrders: 5 },
      { month: "Feb", totalOrders: 8 },
    ])
  ),
  getRevenueAnalytics: vi.fn((req, res) =>
    res.json([
      { month: "Nov", totalRevenue: 500 },
      { month: "Dec", totalRevenue: 700 },
    ])
  ),
  getTotalUsers: vi.fn((req, res) =>
    res.json([
      { month: "Jan", totalUsers: 10 },
      { month: "Feb", totalUsers: 15 },
    ])
  ),
}));

// Mock auth & admin middleware to bypass authentication
vi.mock("../../src/middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (req: Request, res: Response, next: NextFunction) => next(),
}));

vi.mock("../../src/middlewares/admin.middleware", () => ({
  __esModule: true,
  default: (req: Request, res: Response, next: NextFunction) => next(),
}));

describe ("Admin Analytics API", () => {
    it('should return sales per month', async () => {
        const res = await request(app).get("/api/adminAnalytics/sales/month")

        expect(res.status).toBe(200)
        expect(res.body).toEqual([
            { month: "Jan", totalSales: 100 },
            { month: "Feb", totalSales: 200 },
        ])
    })

    it('should return orders per month', async () => {
        const res = await request(app).get("/api/adminAnalytics/orders/month")

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { month: "Jan", totalOrders: 5 },
            { month: "Feb", totalOrders: 8 },
        ]);
    })

    it('should return revenue analytics for last 5 months', async () => {
        const res = await request(app).get("/api/adminAnalytics/revenue/five-months")

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { month: "Nov", totalRevenue: 500 },
            { month: "Dec", totalRevenue: 700 },
        ]);
    })

    it('should return total users per month', async () => {
        const res = await request(app).get("/api/adminAnalytics/total/users")

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { month: "Jan", totalUsers: 10 },
            { month: "Feb", totalUsers: 15 },
        ]);
    })
})