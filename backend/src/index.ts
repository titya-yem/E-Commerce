// Middlewares
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
dotenv.config();

// Database and Routes
import connectDB from "./config/db";

// Routes
import appointmentRoute from "./routes/appointment.route";
import authRoutes from "./routes/auth.route";
import commentRoutes from "./routes/comment.route";
import contactRoute from "./routes/contact.route";
import orderRoute from "./routes/order.route";
import paymentRoute from "./routes/payment.route";
import productRoute from "./routes/product.route";
import serviceRoutes from "./routes/service.route";
import userRoutes from "./routes/user.route";
import adminAnalyticsRoutes from "./routes/adminAnalytics.route";
import webhookRoute from "./routes/webhook.route";

const app = express();
if (process.env.NODE_ENV !== "test") connectDB();

// Webhook Routes
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoute);

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes)
app.use("/api/service", serviceRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/product", productRoute)
app.use("/api/appointment", appointmentRoute)
app.use("/api/contact", contactRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/order", orderRoute)
app.use("/api/adminAnalytics", adminAnalyticsRoutes)

// Login route
app.use("/api/auth", authRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "E-Commerce Backend is running ✅" });
});

export default app;