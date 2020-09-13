import Message from '@models/messages'
import { IConversation } from '@models/conversations'
import { IContext } from '..'

export const converationResolvers = {
    Conversation: {
        lastViewed: (conversation: IConversation, _: any, ctx: IContext) => {
            const user = ctx.currentUser
            if (!user) return 0

            const conversationUser = conversation.users.find((u) => u.user == user)
            if (!conversationUser) return 0

            return conversationUser.lastViewed
        },

        messages: (conversation: IConversation, data: any) => {
            return Message.find({ to: conversation.id })
                .sort({ timestamp: -1 })
                .limit(data.first || 10)
                .skip(data.after || 0)
        },
    },
}
