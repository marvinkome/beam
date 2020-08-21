import { IUser } from '@models/users'
import Conversation from '@models/conversations'
import Message from '@models/messages'
import { IContext } from '..'

export const userResolvers = {
    User: {
        connectedAccounts: (user: IUser) => {
            const youtube = !!user.connectedAccounts?.filter((acc) => acc.platform === 'youtube')
                .length
            const reddit = !!user.connectedAccounts?.filter((acc) => acc.platform === 'reddit')
                .length
            const spotify = !!user.connectedAccounts?.filter((acc) => acc.platform === 'spotify')
                .length

            return {
                youtube,
                reddit,
                spotify,
            }
        },

        lastMessage: async (user: IUser, _: any, ctx: IContext) => {
            const conversation = await Conversation.findOne({
                users: {
                    $all: [user.id, ctx.currentUser?.id],
                },
            })

            return Message.findOne({ to: conversation?.id }).sort('-timestamp')
        },
    },

    Profile: {
        firstName: (profile: { name: string; picture: string }) => {
            return profile.name.split(' ')[0]
        },
    },
}
