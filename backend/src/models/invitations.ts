import { Schema, model, Document } from 'mongoose'
import { IUser } from './users'

export interface IInvitation extends Document {
    user: Schema.Types.ObjectId | string | IUser
    inviteId: string
    createdAt: Date
}

export const invitationSchema: Schema<IInvitation> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    inviteId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now() },
})

// ttl in 24hrs
invitationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })
export default model<IInvitation>('Invitation', invitationSchema)
