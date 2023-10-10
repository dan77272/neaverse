import { Notification } from "@/models/Notification";

export default async function handle(req, res){
    if(req.method === 'GET'){
        try{
            const notifications = await Notification.find().populate("sender", "firstName lastName")
            res.status(200).json(notifications)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching data." });
        }
 
    }else if(req.method === 'PUT'){
        try {
            // Update all notifications where isRead is false, set to true.
            // Adjust the update criteria as per your requirement
            await Notification.updateMany({ isRead: false }, { isRead: true });
            res.status(200).json({ message: "Notifications marked as read" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while updating data." });
        }
    }
}