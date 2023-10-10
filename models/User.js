import mongoose, { models } from "mongoose";
const {Schema} = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cover: {
        type: String
    },
    photo: {
        type: String
    },
    posts: [],
    visibility: {
        type: Boolean,
        default: false
    },
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    friends: []
}, {timestamp: true})

export const User = models.User || mongoose.model('User', userSchema)