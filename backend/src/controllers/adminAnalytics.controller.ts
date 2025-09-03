import Order from "../models/order.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";

export const getSalesPerMonth = async (req: AuthRequest, res: Response) => {
    try {
        const sales = await Order.aggregate([{
            $group: {
                _id: { $month: "$createdAt" },
                totalSales: { $sum: "$totalPrice" },
            }
        },
        { $sort: {_id: 1} },
        ]);
        
        res.json(sales);
    } catch (error) {
        console.log(error);
    res.status(500).json({ message: "Failed to fetch sales per month" });
    }
}

export const getOrdersPerMonth = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.aggregate([{
            $group: {
                _id: { $month: "$createdAt" },
                orderCount: { $sum: 1 },
            }
        },
        { $sort: {_id: 1} },
        ]);

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch orders per month" });
    }
}

export const getRevenueAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: { $ceil: { $divide: [{ $month: "$createdAt" }, 5] } },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(revenue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch revenue analytics" });
  }
};