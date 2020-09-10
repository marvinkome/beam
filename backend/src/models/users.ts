import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    email: string
    googleId?: string
    facebookId?: string
    lastSeen?: Date | null
    notificationToken?: string
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
    requests: Array<{ from: Schema.Types.ObjectId[] | string[] | IUser[]; date: Date }>
    declinedRequests: Schema.Types.ObjectId[] | string[] | IUser[]
    connectedAccounts?: Array<{
        id: string
        name: string
        image: string
        type?: 'artist' | 'genre' // for spotify
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
        notificationToken: String,

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
                type: {
                    type: String,
                    required: false,
                },
            },
        ],

        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        requests: [
            {
                from: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        declinedRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
)

const User = model<IUser>('User', userSchema)
export default User
