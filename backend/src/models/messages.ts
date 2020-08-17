import { Schema, model, Document } from 'mongoose'
import { IConversation } from './conversations'
import { IUser } from './users'

export interface IMessage extends Document {
    message: string
    timestamp: Date
    from: Schema.Types.ObjectId | string | IUser
    to: Schema.Types.ObjectId | string | IConversation
}

export const messageSchema: Schema<IMessage> = new Schema({
    message: String,
    timestamp: {
        default: Date.now,
        type: Date,
    },

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    },
})

export default model<IMessage>('Message', messageSchema)
