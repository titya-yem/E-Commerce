import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// User login
export const signIn = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Get JWT secret
        const secret = process.env.JWT_SECRET
        if (!secret) {
            return res.status(500).json({ message: 'JWT secret is not set' })
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(payload, secret, { expiresIn: '7h' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        
        res.status(200).json({ message: 'Login successful', token, 
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: process.env.NODE_ENV === "production" ? "Server error" : "Failed to login user",
        })
    }
}

// User logout
export const signOut = async (req: Request, res: Response): Promise<void | any> => {
    try {
        // clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })

        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: process.env.NODE_ENV === "production" && error instanceof Error ? error.message : "Failed to logout user"
        })
    }
}

// Get current user
export const getMe = async (req: Request, res: Response): Promise<void | any> => {
    try {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Type assertion or use JwtPayload interface
    const { id } = decoded as { id: string };

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json({
        isAuthenticated: true,
        user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isActive: user.isActive,
        role: user.role
        },
    });
    } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(401).json({ isAuthenticated: false });
    }
};

// Update login user
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokenUserId = (req as any).user?.id;
    if (!tokenUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { userName, email, password } = req.body;

    const updateData: any = {};
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      tokenUserId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser?._id,
        userName: updatedUser?.userName,
        email: updatedUser?.email,
        role: updatedUser?.role,
        isActive: updatedUser?.isActive,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};