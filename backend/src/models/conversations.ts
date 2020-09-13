import { Schema, model, Document } from 'mongoose'
import { IUser } from './users'

export interface IConversation extends Document {
    users: Array<{
        user: Schema.Types.ObjectId | string | IUser

        lastViewed?: Date | null
    }>
}

export const conversationSchema: Schema<IConversation> = new Schema({
    users: {
        type: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },

                lastViewed: Date,
            },
        ],
        validate: [(val: []) => val.length <= 2, '{PATH} exceeds the limit of 2'],
    },
})

const Conversation = model<IConversation>('Conversation', conversationSchema)
export default Conversation
