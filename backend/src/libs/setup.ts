import User, { IUser } from '@models/users'
import { sendWelcomeEmail } from './emails'
import { sendMessageFromBot } from './bot'

export async function registerSetup(user: IUser) {
    // send welcome email
    sendWelcomeEmail({ to: user.email })

    // add bot as friend
    let bot = await User.findOne({ email: process.env.BOT_EMAIL })
    if (!bot) {
        bot = new User({
            email: process.env.BOT_EMAIL,
            bot: true,
            profile: {
                name: 'Beambot',
                picture: null,
            },
        })

        await bot.save()
    }

    await user.updateOne({
        $addToSet: { friends: bot },
    })

    await bot.updateOne({
        $addToSet: { friends: user },
    })

    // send initial message
    await sendMessageFromBot(user, "Hello, I'm a bot 👋")
    await sendMessageFromBot(user, 'Welcome to your new account :D')
    await sendMessageFromBot(
        user,
        "From time to time I'll send you messages and updates from the team at Beam"
    )
    await sendMessageFromBot(
        user,
        "For now, I can't reply to your messages so add your friends to start chatting."
    )
    await sendMessageFromBot(
        user,
        'You can also find new friends by tapping your profile picture and clicking on "Find a friend".'
    )
    await sendMessageFromBot(user, 'Keep in mind that you can only have 15 friends on Beam.')
    await sendMessageFromBot(
        user,
        'Only invite people you want to chat with and remember to practice social distancing. 🙂'
    )
}
