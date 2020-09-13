import { Schema, model, Document } from 'mongoose'
import { IConversation } from './conversations'
import { IUser } from './users'
import { IGroup } from './groups'

export interface IMessage extends Document {
    message: string
    timestamp: Date
    from: Schema.Types.ObjectId | string | IUser
    to: Schema.Types.ObjectId | string | IConversation | IGroup
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

    // to either conversation or group
    to: {
        type: Schema.Types.ObjectId,
        refPath: 'ToModel',
    },

    // ref path
    ToModel: {
        type: String,
        enum: ['Group', 'Conversation'],
    },
})

const Message = model<IMessage>('Message', messageSchema)
export default Message
