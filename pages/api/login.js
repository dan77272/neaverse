import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default async function handle(req, res) {
    await mongoose.connect(process.env.MONGODB);
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ error: "Wrong password." });
            }
        } else {
            res.status(404).json({ error: "User not found." });
        }
    }
}
