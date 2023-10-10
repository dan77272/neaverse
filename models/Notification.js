import mongoose, { models } from "mongoose";
const {Schema} = mongoose

const notificationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientFirstName: {
        type: String
    },
    recipientLastName: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    requestButton: {
        type: String,
        default: 'Add Friend'
    }
}, {timestamps: true})

export const Notification = models.Notification || mongoose.model('Notification', notificationSchema)
