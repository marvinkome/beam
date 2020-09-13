import { Schema, model, Document } from 'mongoose'
import { IConversation } from './conversations'
import { IUser } from './users'
import { IGroup } from './groups'

export interface IMessage extends Document {
    message: string
    timestamp: Date
    from: Schema.Types.ObjectId | string | IUser
    toGroup: Schema.Types.ObjectId | string | IGroup
    toConversation: Schema.Types.ObjectId | string | IConversation
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
    toGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
    },

    toConversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    },
})

const Message = model<IMessage>('Message', messageSchema)
export default Message
