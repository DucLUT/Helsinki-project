import Message from "../models/Message.js";
import { getIO, getConnectedUsers } from "../socket/socket.js"; // Adjust the import path as necessary
export const sendMessage = async (req, res) => {
    try {
        const {content, receiverId} = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
        });

        const io = getIO();
        const connectedUsers = getConnectedUsers();
        const receiverSocketId = connectedUsers.get(receiverId);



        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            message: newMessage,
        });
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage,
                sender: req.user.id,
            });
        } else {
            console.log("Receiver is not connected");
        }
    } catch (error) {
        console.log("Error in sendMessage: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
};

export const getConversation = async (req, res) => {
    const {userId} = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id },
            ],
        })
        .populate("sender", "name image")
        .populate("receiver", "name image")
        .sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({
                success: false,
                message: "No messages found",
            });
        }
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        console.log("Error in getConversation: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
};