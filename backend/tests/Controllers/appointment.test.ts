import request from "supertest"; // library to make fake HTTP requests to our server
import app from "../../src/index"; // import the express app
import { describe, it, expect, vi } from "vitest"; // Vitest testing functions
import { Request, Response, NextFunction } from "express"; // TypeScript types
import { Types } from "mongoose";

// Mock auth middleware to simulate a logged-in user for tests
vi.mock("../../src/middlewares/auth.middleware", () => ({
  default: (req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: new Types.ObjectId(), role: "user" }; // fake user injected
    next(); // continue to the controller
  },
  AuthRequest: {} // required export for TS
}));

// Mock admin middleware to bypass admin check for testing admin routes
vi.mock("../../src/middlewares/admin.middleware", () => ({
  default: (req: Request, res: Response, next: NextFunction) => next()
}));


describe("Appointment API", () => {
  let appointmentId: string | undefined; // store appointment ID for update/delete tests

  // Test: Required fields missing for creation
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post("/api/appointment/create") // hit create route
      .send({}); // send empty body, should fail

    expect(res.status).toBe(400); // expect Bad Request
    expect(res.body.message).toBeDefined(); // expect error message returned
  });

  // Test: Successfully create a new appointment
  it('should create a new appointment', async () => {
    const res = await request(app)
      .post("/api/appointment/create")
      .send({
        type: "Vacation", // Appointment Type
        email: "test@gmail.com", // User email
        time: "10:00 AM", // Appointment Time
        date: "2025-10-10", // Appointment Date
        message: "Please take care of my dog" // Optional message
      });

    expect(res.status).toBe(201); // Created successfully
    expect(res.body).toHaveProperty("_id"); // response contains _id
    expect(res.body.email).toBe("test@gmail.com"); // email matches
    expect(res.body.type).toBe("Vacation")

    appointmentId = res.body._id; // store the ID for update/delete
  });

  // Test: Fetch user's own appointments
  it('should fetch user appointments', async () => {
    const res = await request(app)
      .get("/api/appointment/my-appointments");

    expect(res.status).toBe(200); // OK
    expect(Array.isArray(res.body)).toBe(true); // response should be an array
  });

  // Test: Fetch all appointments monthly (admin)
  it('should fetch all appointments by monthly for admin', async () => {
    const res = await request(app)
      .get("/api/appointment/monthly"); // admin route

    expect(res.status).toBe(200); // OK
    expect(Array.isArray(res.body)).toBe(true); // should return array
  });

  // Test: Update appointment status
  it('should update appointment status', async () => {
    const res = await request(app)
      .patch(`/api/appointment/${appointmentId}/status`) // use stored appointmentId
      .send({ status: "Completed" }); // new status

    expect(res.status).toBe(200); // OK
    expect(res.body.status).toBe("Completed"); // status updated
  });

  // Test: Delete an appointment
  it('should delete appointment', async () => {
    const res = await request(app)
      .delete(`/api/appointment/${appointmentId}`); // delete route

    expect(res.status).toBe(200); // OK
    expect(res.body.message).toBe("Appointment deleted successfully"); // success message
  });
});
