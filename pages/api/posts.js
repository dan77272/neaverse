import { Post } from "@/models/Post";
import mongoose from "mongoose";

export default async function handle(req, res) {
  mongoose.connect(process.env.MONGODB);

  if (req.method === "GET") {
    // Handle HTTP GET requests to fetch all posts and populate the "creator" field
    try {
      const allPosts = await Post.find({})
        .populate("creator", "firstName lastName photo")
        .exec();

      res.status(200).json(allPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  } else if (req.method === "POST") {
    // Handle HTTP POST requests to add a new post
    try {
      const { content, creator, likes } = req.body;

      // Create a new Post instance with the received data
      const newPost = new Post({
        content,
        creator,
        likes,
      });

      // Save the new post document to the "Post" collection
      await newPost.save();

      res.status(201).json(newPost); // Respond with the newly created post
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while saving the post." });
    }
  }else if (req.method === 'PUT') {
    const { id } = req.query;
    const { userId, type, comment, firstName, lastName, profilePic } = req.body;
    if(type === 'like'){
      try {
        const selectedPost = await Post.findById(id)
        // Use $push to add the userId to the 'like' array
        if(!selectedPost.like.includes(userId)){
          const post = await Post.findByIdAndUpdate(id, { $push: { like: userId }, $inc: { likes: 1 } }, { new: true }).populate("creator", "firstName lastName photo");
          res.status(200).json(post);
        }else{
          const post = await Post.findByIdAndUpdate(id, { $pull: { like: userId }, $inc: { likes: -1 } }, { new: true }).populate("creator", "firstName lastName photo");
          res.status(200).json(post);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred." });
      }
    }else if(type === 'comment'){
      try {
        // Find the post by ID
        const selectedPost = await Post.findById(id);
        // Create a new comment object
        const newComment = {
          content: comment,
          creator: userId,
          firstName: firstName,
          lastName: lastName,
          profilePic: profilePic
        };
        // Push the new comment to the 'comments' array in the post document
        selectedPost.comments.push(newComment);
        // Save the updated post with the new comment
        const updatedPost = await selectedPost.save();
        // Respond with the updated post data
        res.status(200).json(updatedPost);  
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while posting the comment." });
      }
    } else {
      // Handle other HTTP methods if needed
      res.status(405).json({ error: "Method not allowed." });
    }
    }

}
