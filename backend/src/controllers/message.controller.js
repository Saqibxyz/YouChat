import User from "../models/user.models.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUserForSideBar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      imageUrl,
    });
    await newMessage.save();
    // todo: realtime functionality goes here with socket.io

    res.status(201).json(newMessage);
  } catch (error) {
      console.log("Error in sendMessages controller ", error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
