import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/order.model";
import orderValidation from "../validations/order.validation";

export const getOrders = async (req: AuthRequest, res: Response): Promise<void | any> => {
    try {
        let orders;

        if (req.user?.role === "admin") {
            orders = await Order.find({}).select("-__v");
        } else {
            orders = await Order.find({ user: req.user?.id }).select("-__v");
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

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void | any> => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id).select("-__v");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (req.user?.role === "admin" && order.user.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Forbidden: You can only view your own orders" });
        }

        res.status(200).json( order );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get order" });
    }
}

export const updateOrder = async (req: AuthRequest, res: Response): Promise<void | any> => {
    const { id } = req.params;
    try {
        const { error, value } = orderValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updateData = {
            status: value.status,
            isPaid: value.isPaid,
        };

        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update order" });
    }
}

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