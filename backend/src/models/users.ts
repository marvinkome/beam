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
    connectedAccounts?: {
        youtube: {
            subscriptions: Array<{ id: string; name: string }>
        }
        reddit: {
            subreddits: Array<{ id: string; name: string }>
        }
        spotify: {
            artists: Array<{ id: string; name: string }>
            genres: string[]
        }
    }
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

        connectedAccounts: {
            youtube: {
                subscriptions: [
                    {
                        id: String,
                        name: String,
                    },
                ],
            },
            reddit: {
                subreddits: [
                    {
                        id: String,
                        name: String,
                    },
                ],
            },
            spotify: {
                artists: [
                    {
                        id: String,
                        name: String,
                    },
                ],
                genres: [String],
            },
        },

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
