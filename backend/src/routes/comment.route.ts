import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  updateCommentStatus,
  getAllCommentsAdmin,
  getMyComments
} from "../controllers/comment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

// Public Route
router.get("/", getAllComments);

// User Routes
router.get("/me", auth, getMyComments);
router.post("/create", auth, createComment);
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

// Admin Routes
router.get("/admin/all", auth, admin, getAllCommentsAdmin);
router.patch("/:id/status", auth, admin, updateCommentStatus);
router.delete("/:id/admin", auth, admin, deleteComment);

export default router;
