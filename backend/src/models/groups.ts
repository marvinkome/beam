import { Schema, Document, model } from 'mongoose'
import { IUser } from './users'

export const Permissions = {
    SEND_MESSAGE: 0x01,
    DELETE_MESSAGE: 0x02,
    CREATE_USER_INVITE: 0x04,
    DELETE_USER: 0x08,
}

export const Roles = {
    user: {
        name: 'user',
        permission: Permissions.SEND_MESSAGE,
    },
    mod: {
        name: 'moderator',
        permission: Permissions.SEND_MESSAGE | Permissions.DELETE_MESSAGE,
    },
    admin: {
        name: 'administrator',
        permission:
            Permissions.SEND_MESSAGE |
            Permissions.DELETE_MESSAGE |
            Permissions.DELETE_USER |
            Permissions.CREATE_USER_INVITE,
    },
}

export interface IGroup extends Document {
    name: string
    image: string
    interest: string
    location: string
    users: Array<{
        user: Schema.Types.ObjectId | string | IUser
        role: { name: string; permission: number }
        lastViewed?: Date | null
    }>
}

export const groupSchema: Schema<IGroup> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        image: String,

        interest: String,
        location: String,

        users: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                role: { name: String, permission: Number },

                lastViewed: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Group = model<IGroup>('Group', groupSchema)
export default Group
