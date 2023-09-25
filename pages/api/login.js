import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res){
    mongoose.connect(process.env.MONGODB)
    if(req.method === 'POST'){
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(user){
            if(password === user.password)
            res.status(200).json(user)
        }
        else{
            res.status(409).json({error: "Wrong email or password"})
        }
        

        }
    }