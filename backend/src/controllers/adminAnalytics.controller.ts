import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/order.model";
import User from "../models/user.model";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Total sales per month
export const getSalesPerMonth = async (req: AuthRequest, res: Response) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = sales.map(item => ({
      month: months[item._id - 1],
      totalSales: item.totalSales
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch monthly sales" });
  }
};

// Total orders per month
export const getOrdersPerMonth = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = orders.map(item => ({
      month: months[item._id - 1],
      totalOrders: item.totalOrders
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch monthly orders" });
  }
};

// Revenue analytics for last 5 months
export const getRevenueAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(now.getMonth() - 5);

    const revenue = await Order.aggregate([
      { $match: { createdAt: { $gte: fiveMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = revenue.map(item => ({
      month: months[item._id - 1],
      totalRevenue: item.totalRevenue
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
};

// Total users
export const getTotalUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    const result = users.map(item => ({
      month: months[item._id - 1],
      totalUsers: item.totalUsers
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch total users" });
  }
};