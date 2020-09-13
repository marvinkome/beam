import Message from '@models/messages'
import { IConversation } from '@models/conversations'

export const converationResolvers = {
    Conversation: {
        messages: (conversation: IConversation, data: any) => {
            return Message.find({ to: conversation?.id })
                .sort({ timestamp: -1 })
                .limit(data.first || 10)
                .skip(data.after || 0)
        },
    },
}
