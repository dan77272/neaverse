import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


export default async function handle(req, res){
    mongoose.connect(process.env.MONGODB)
    if(req.method === 'POST'){
        const {firstName, lastName, email, password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(409).json({error: "Username already exists"})
        }
        else{
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const user = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            })
            res.status(200).json(user)
        }

    }
} 