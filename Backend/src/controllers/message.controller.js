import Message from "../models/message.model.js";
import User from "../models/user.models.js";


export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user.id;
        const filterdUsers = await User.find({_id: { $ne: loggedInUserId }}).select("-password");

        res.status(200).json(filterdUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]   
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const sendMessages = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const senderId =  req.user._id;
        const { text, image } = req.body;

        let imageUrl;

        if(image){
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //todo: realtime functionality with socket.io

        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};