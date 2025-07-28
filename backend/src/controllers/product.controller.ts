import { Request, Response } from "express";
import _ from "lodash";
import Product from "../models/product.model";
import productValidation from "../validations/product.validation";

// Define the allowed fields for product creation and update
const allowedFields = ["name", "category", "price", "rating", "reviews", "description", "image"];

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const products = await Product.find().select("-__v");
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get products" });
    }
}

// Get a single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(id).select("-__v");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get product" });
    }
}

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { error, value } = productValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const filderData = _.pick(value, allowedFields)
        const newProduct = new Product(filderData);
        
        await newProduct.save()

        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create product" });
    }
}

// Update a product by ID
export const updateProduct = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const { error, value } = productValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updateData = _.pick(value, allowedFields);
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update product" });
    }
}

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const deleteProduct = await Product.findByIdAndDelete(id)
        if (!deleteProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete product" });
    }
}