import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  updateCommentStatus,
  getAllCommentsAdmin,
} from "../controllers/comment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

// Public Route
router.get("/", getAllComments);

// User Routes
router.post("/create", auth, createComment);
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

// Admin Routes
router.get("/admin/all", auth, admin, getAllCommentsAdmin); // new admin route
router.patch("/:id/status", auth, admin, updateCommentStatus);
router.delete("/:id/admin", auth, admin, deleteComment); // admin delete route

export default router;
