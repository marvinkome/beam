import User, { IUser } from '@models/users'
import Conversation from '@models/conversations'
import Message from '@models/messages'
import { pubsub } from 'src/graphql'
import { sendNotification } from 'src/libs/helpers'

export async function sendMessageFromBot(toUser: IUser, msg: string) {
    const bot = await User.findOne({ email: process.env.BOT_EMAIL })
    if (!bot) return false

    let conversation = await Conversation.findOne({
        'users.user': {
            $all: [toUser.id, bot.id],
        },
    })

    if (!conversation) {
        conversation = new Conversation()
        conversation.users = [toUser.id, bot.id]

        await conversation.save()
    }

    // create message
    const message = new Message()
    message.message = msg
    message.from = bot.id
    message.toConversation = conversation.id

    await message.save()

    // publish change with pubsub
    await pubsub.publish('SENT_MESSAGE', {
        messageSent: message,
        friendId: bot.id,
    })

    // send push notification
    if (toUser.lastSeen) {
        await sendNotification({
            type: 'user',
            userToken: toUser.notificationToken || '',
            title: 'Beambot',
            body: message.message,
            linkPath: `/app/chat/${bot.id}`,
        })
    }
}
