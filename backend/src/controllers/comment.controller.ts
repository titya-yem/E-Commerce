import { Request, Response } from "express";
import _ from "lodash";
import Comment from "../models/comment.model";
import commentValidation from "../validations/comment.validation";
import { AuthRequest } from "../middlewares/auth.middleware";

const allowedFields = ["title", "text", "type"];

// Get all public (approved) comments
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ status: "Approved" }).populate(
      "userName",
      "userName email"
    );

    if (!comments || comments.length === 0)
      return res.status(404).json({ message: "No comments found" });

    res.status(200).json(comments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot fetch comments" });
  }
};

// Create comment (user)
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = commentValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const data = _.pick(value, allowedFields);
    data.userName = req.user?.id; // set from auth middleware
    data.status = "Pending"; // Auto set status to Pending

    const newComment = new Comment(data);
    await newComment.save();
    await newComment.populate("userName", "userName email");

    res.status(201).json({ message: "Comment created successfully", comment: newComment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot create comment" });
  }
};

// Update comment (user can update own and admin)
export const updateComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Comment ID is required" });

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user?.role !== "admin" && comment.userName.toString() !== req.user?.id ) {
      return res.status(403).json({ message: "Forbidden: You can only update your own comment" });
    }

    const { error, value } = commentValidation.validate(req.body);
    if (error) 
      return res.status(400).json({ message: error.details[0].message });

    const updateData = _.pick(value, allowedFields);
    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("userName", "userName email");

    res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot update comment" });
  }
};

// Delete comment (user deletes own or admin deletes any)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Comment ID is required" });

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user?.role !== "admin" && comment.userName.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own comment" });
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot delete comment" });
  }
};

// Update comment status (admin only)
export const updateCommentStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) return res.status(400).json({ message: "Comment ID and status are required" });

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id, 
      { status },
      { new: true })
      .populate("userName", "userName email");

    if (!updatedComment) return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ message: "Comment status updated", comment: updatedComment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot update comment status" });
  }
};

// Admin: Get all comments including pending
export const getAllCommentsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await Comment.find().populate("userName", "userName email");
    res.status(200).json(comments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot fetch comments" });
  }
};

// Get user's comments
export const getMyComments = async (req: AuthRequest, res: Response): Promise < void | any> => {
  try {
    const userId = req.user?.id

    const comments = await Comment.find({ userName: userId })
    .populate("userName", "userName email");
    
    if (!comments || comments.length === 0) return res.status(404).json({ message: "No Comments Found" })

    res.status(200).json(comments)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Cannot fetch user's comments" })
  }
}