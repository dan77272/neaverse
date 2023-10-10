import { Notification } from "@/models/Notification";
import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res){
    await mongoose.connect(process.env.MONGODB);

    if(req.method === 'DELETE'){
        try{
            const {recipient, sender} = req.query
            const notification = await Notification.findOne({ 
                sender: sender, 
                recipient: recipient,
                type: 'FRIEND_REQUEST'
            });
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            await Notification.deleteOne({_id: notification._id});
            await User.updateOne(
                { _id: recipient }, 
                { $pull: { notifications: notification._id } }
            );
            return res.status(200).json({ message: 'Friend request declined' });
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting data.' });
        }

    }
}