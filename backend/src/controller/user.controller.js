import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = await req.auth(); // ✅ Call req.auth() properly
    const users = await User.find({ clerkId: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth().userId;
    const { userId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}