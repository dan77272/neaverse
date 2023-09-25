import { User } from "@/models/User";
import mongoose from "mongoose";

export default async function handle(req, res) {
  mongoose.connect(process.env.MONGODB);

  if (req.method === 'GET') {
    const {id} = req.query
    if(id){
        const user = await User.findById(id)
        res.status(200).json(user);
    }else{
        const loggedInUser = localStorage.getItem('loggedInUser');
        const user = JSON.parse(loggedInUser);
        res.json(user.email);
    }

  } else if (req.method === 'PUT') {
    console.log(req.body)
    const { cover, profilePic, posts } = req.body;
    const { id } = req.query;
    if(cover){
      try {
        const user = await User.findByIdAndUpdate(id, { cover: cover });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update user.' });
      }
    }else if(profilePic){
      try {
        const user = await User.findByIdAndUpdate(id, { photo: profilePic });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update user.' });
      }
    }else if(posts){
      try {
        const user = await User.findByIdAndUpdate(id, { posts: posts });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update user.' });
      }
    }

  } else {
    res.status(401).json('no token');
  }
}