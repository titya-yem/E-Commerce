import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  updateCommentStatus,
} from "../controllers/comment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

// Public Route
router.get("/", getAllComments);

// Protected Routes
router.post("/create", auth, createComment);
router.put("/:id", auth, updateComment);
router.patch("/:id/status", auth, admin, updateCommentStatus); // new route
router.delete("/:id", auth, admin, deleteComment);

export default router;
