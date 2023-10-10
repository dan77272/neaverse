import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res){
    mongoose.connect(process.env.MONGODB)
    if(req.method === 'GET'){
        const id = req.query.id;
        
        if(id){
            try{
                const user = await User.findById(id)
                res.status(200).json(user) 
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while fetching data." });
            }

        }else{
            try{
                const users = await User.find()
                res.status(200).json(users) 
    
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while fetching data." });
            }
        }

    }else if(req.method === 'PUT'){
        const {id, newName, newLastName, isPrivate, type} = req.body
        if(type === 'visibility'){
            try{
                const user = await User.findByIdAndUpdate(id, {visibility: !isPrivate}, { new: true });
                res.status(200).json(user);
            }catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred." });
              }
        }else{
            try{
                const user = await User.findByIdAndUpdate(id, {firstName: newName, lastName: newLastName})
                res.status(200).json(user);
            }catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred." });
          }
        }
    }
}