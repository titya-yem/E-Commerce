import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/order.model";

// Get all orders
export const getOrders = async (req: AuthRequest, res: Response): Promise<void | any> => {
  try {
    let orders;

    // If role is admin
    if (req.user?.role === "admin") {
      orders = await Order.find({})
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("user", "email");
    } else {

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Fetch order for user by ID
      orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("user", "email");
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

// Get Order for user
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void | any> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const order = await Order.findById(id)
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only admin or owner can access
    if (req.user?.role !== "admin" && order.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only view your own orders" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get order" });
  }
};

// Update order status by ID
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void | any> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Delete order by ID
export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void | any> => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
