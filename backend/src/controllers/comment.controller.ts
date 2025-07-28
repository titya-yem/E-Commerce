import { Request, Response } from "express";
import _ from "lodash";
import Comment from "../models/comment.model";
import commentValidation from "../validations/comment.validation";

// Define the allowed fields fortype of pet lovers
const petRequired = ["title", "text", "userName", "type"];

// Get all comments
export const getAllComments = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const comments = await Comment.find().populate("userName", "userName");
        if(!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Cannot fetch comments" });
    }
}

// Create a comment by ID
export const createComment = async (req: Request, res: Response): Promise<void | any> => {
    try {
      const { error, value } = commentValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const data = _.pick(value, petRequired);
      const newComment = new Comment(data);
  
      await newComment.save();
      await newComment.populate("userName", "userName email");  
      
      res.status(201).json({message: "Comment created successfully",comment: newComment});
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Cannot create comment" });
    }
  };
  

// Update a comment by ID
export const updateComment = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const {error, value} = commentValidation.validate(req.body)
        if(error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updateData = _.pick(value, petRequired);
        const updatedComment = await Comment.updateOne({_id: id}, updateData, { new: true });
        if(!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Cannot update comment" });
    }
}

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void | any> => {
    const {id} = req.params;
    if(!id) {
        return res.status(400).json({ message: "Comment ID is required" });
    }
    try {

        const deleteComment = await Comment.deleteOne({ _id: id });
        if(!deleteComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Cannot delete comment" });
    }
}