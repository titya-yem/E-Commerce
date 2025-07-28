import { Router } from "express";
import {
    createComment,
    deleteComment,
    getAllComments,
    updateComment,
} from "../controllers/comment.controller";

const router = Router();

router.get("/", getAllComments)
router.post("/create", createComment)
router.put("/:id", updateComment)
router.delete("/:id", deleteComment)

export default router;