import { Notification } from "@/models/Notification";
import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res){
    await mongoose.connect(process.env.MONGODB);

    if(req.method === 'POST'){
        try{
            const {friendId, firstName, lastName, id} = req.body
            const user = await User.findById(friendId)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const notification = await Notification.create({
                sender: id,
                recipient: user._id,
                recipientFirstName: user.firstName,
                recipientLastName: user.lastName,
                type: 'FRIEND_REQUEST',
                requestButton: 'Request Sent'
            })

            user.notifications.push(notification._id)
            await user.save()

            return res.status(200).json({ message: 'Friend request sent!', requestButton: notification.requestButton  });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching data." });
          }
    }else if(req.method === 'PUT'){
        try {
            const {sender, recipient} = req.body
            const notification = await Notification.findOne({ 
                sender: sender, 
                recipient: recipient,
                type: 'FRIEND_REQUEST'
            });
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            await Notification.deleteOne({_id: notification._id});
            const senderUser = await User.findByIdAndUpdate(sender, {$push: {friends: recipient}}, {new: true, useFindAndModify: false})
            const recipientUser = await User.findByIdAndUpdate(recipient, {$push: {friends: sender}}, {new: true, useFindAndModify: false})
            const user = await User.findById(sender)
            const user2 = await User.findById(recipient)
            const friendRequestAcceptedNotification = await Notification.create({
                sender: recipient, 
                recipient: sender,
                recipientFirstName: user2.firstName,
                recipientLastName: user2.lastName,
                type: 'REQUEST_ACCEPTED',
                requestButton: 'Friends'
            })
            user.notification.push(friendRequestAcceptedNotification._id)
            await user.save()
            return res.status(200).json(senderUser, recipientUser)
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching data." });
          }
        
    }else if(req.method === 'DELETE'){
        try{
            const {recipient, sender} = req.query
            const notification = await Notification.findOne({ 
                sender: sender, 
                recipient: recipient,
                type: 'REQUEST_ACCEPTED'
            });
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            await Notification.deleteOne({_id: notification._id});
            await User.updateOne(
                { _id: recipient }, 
                { $pull: { notifications: notification._id } }
            );
            return res.status(200).json({ message: 'Notification Deleted' });
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while deleting data." });
          }
    }
}