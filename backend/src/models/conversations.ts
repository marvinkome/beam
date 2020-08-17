import { Schema, model, Document } from 'mongoose'
import { IUser } from './users'

export interface IConversation extends Document {
    users: Schema.Types.ObjectId[] | string[] | IUser[]
}

export const conversationSchema: Schema<IConversation> = new Schema({
    users: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        validate: [(val: []) => val.length <= 2, '{PATH} exceeds the limit of 2'],
    },
})

export default model<IConversation>('Conversation', conversationSchema)
