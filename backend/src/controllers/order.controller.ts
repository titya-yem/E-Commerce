import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/order.model";
import orderValidation from "../validations/order.validation";

// Get all orders
export const getOrders = async (req: AuthRequest, res: Response): Promise<void | any> => {
    try {
        let orders;

        if (req.user?.role === "admin") {
            orders = await Order.find({}).select("-__v").populate("user", "email");;
        } else {
            orders = await Order.find({ user: req.user?.id }).select("-__v").populate("user", "email");;
        }

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get orders" });
    }
}

// Get Order By ID
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void | any> => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .select("-__v")
      .populate("user", "email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user?.role !== "admin" && order.user._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden: You can only view your own orders" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get order" });
  }
};

// Update order by ID
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Delete order by ID
export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void | any> => {
    const { id } = req.params;
    try {
        const deleteOrder = await Order.findByIdAndDelete(id);
        if (!deleteOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete order" });
    }
}