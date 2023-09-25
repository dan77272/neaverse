import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res){
    mongoose.connect(process.env.MONGODB)
    if(req.method === 'GET'){

        try{
            const users = await User.find()
            res.status(200).json(users)

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching data." });
        }
    }
}