import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    email: string
    googleId?: string
    facebookId?: string
    lastSeen?: Date | null
    bot?: boolean
    deviceToken?: string
    friends: Schema.Types.ObjectId[] | string[] | IUser[]
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
    connectedAccounts?: Array<{
        id: string
        name: string
        image: string
        platform: 'youtube' | 'spotify' | 'reddit'
    }>
}

export const userSchema: Schema<IUser> = new Schema(
    {
        // user information
        email: {
            type: String,
            unique: true,
            minlength: 3,
            required: true,
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

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        // accounts
        connectedAccounts: [
            {
                id: String,
                name: String,
                image: String,
                platform: String,
            },
        ],

        // auth ids
        googleId: String,
        facebookId: String,

        // chat information
        lastSeen: Date,
        deviceToken: String,

        bot: {
            default: false,
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IUser>('User', userSchema)
