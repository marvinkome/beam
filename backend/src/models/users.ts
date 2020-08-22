import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    email: string
    googleId?: string
    facebookId?: string
    lastSeen?: Date | null
    bot?: boolean
    profile: {
        name?: string
        picture?: string
        location?: {
            lat: number
            long: number
            state: string
            city: string
            country: string
        }
    }
    friends: Schema.Types.ObjectId[] | string[] | IUser[]
    connectedAccounts?: Array<{
        id: string
        name: string
        platform: 'youtube' | 'spotify' | 'reddit'
    }>
}

export const userSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            unique: true,
            minlength: 3,
            required: true,
        },

        googleId: String,
        facebookId: String,

        lastSeen: Date,

        bot: {
            default: false,
            type: Boolean,
        },

        profile: {
            name: String,
            picture: String,
            location: {
                lat: Number,
                long: Number,
                state: String,
                city: String,
                country: String,
            },
        },

        connectedAccounts: [
            {
                id: String,
                name: String,
                image: String,
                platform: String,
            },
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
)

export default model<IUser>('User', userSchema)
