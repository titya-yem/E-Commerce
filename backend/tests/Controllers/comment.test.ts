import request from "supertest";
import app from "../../src/index";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Request, Response, NextFunction } from "express";
import Comment from "../../src/models/comment.model";

// Use string for mockUserId to avoid ObjectId mismatch
const mockUserId = "66f0f0f0f0f0f0f0f0f0f0f0";

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

describe("Comment API", () => {
  let commentId: string | undefined; // store one comment ID to reuse later

  // Seed one approved comment so GET /api/comment works
  beforeAll(async () => {
    await Comment.create({
      title: "Approved comment",
      text: "This is already approved",
      type: "Dogs Lover",
      userName: mockUserId,
      status: "Approved",
    });
  });

  // 1. Get all approved comments (public)
  it("should return all approved comments", async () => {
    const res = await request(app).get("/api/comment");

    // Expect response to be successful and return an array
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. Create new comment
  it("should create a new comment", async () => {
    const res = await request(app)
      .post("/api/comment/create")
      .send({
        title: "Best caring pets service",
        text: "Your services are really good, I love it!",
        type: "Dogs Lover",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment).toHaveProperty("_id");
    expect(res.body.comment.status).toBe("Pending");

    commentId = res.body.comment._id;
  });

  // 3. Update own comment
  it("should update their own comment", async () => {
    const res = await request(app)
      .put(`/api/comment/${commentId}`)
      .send({
        title: "Updated title",
        text: "Updated text",
        type: "Cats Lover",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment.title).toBe("Updated title");
  });

  // 4. Admin updates status
  it("should update comment status (admin)", async () => {
    const res = await request(app)
      .patch(`/api/comment/${commentId}/status`)
      .send({ status: "Approved" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment.status).toBe("Approved");
  });

  // 5. Get user’s own comments
  it("should get all comments for the logged-in user", async () => {
    const res = await request(app).get("/api/comment/me");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 6. Admin gets all comments
  it("should get all comments as admin", async () => {
    const res = await request(app).get("/api/comment/admin/all");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 7. Delete a comment
  it("should delete their own comment", async () => {
    const res = await request(app).delete(`/api/comment/${commentId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Comment deleted successfully");
  });
});
