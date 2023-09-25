import mongoose, {models} from "mongoose";
const {Schema} = mongoose

const postSchema = new Schema({
    content: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Number,
        default: 0
    },
    like: [],
    comments: []
}, {timestamps: true})

export const Post = models.Post || mongoose.model('Post', postSchema)