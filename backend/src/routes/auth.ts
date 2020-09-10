import passport from 'passport'
import { Router } from 'express'
import { generateToken } from '@libs/auth'
import User, { IUser } from '@models/users'
import { messaging } from 'firebase-admin'

const router = Router()

// all rest auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', (req, res, next) => {
    return passport.authenticate('google', { session: false }, (err, user: IUser, info) => {
        if (err) return next(err)

        if (user) {
            const token = generateToken(user)

            // send data back to the app/website
            // return res.redirect(`beam://auth?token=${token}`)
            return res.redirect(`${process.env.CLIENT_URL}/register?token=${token}`)
        }

        return res.status(400).send({
            error: info,
        })
    })(req, res, next)
})

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))
router.get('/facebook/callback', (req, res, next) => {
    return passport.authenticate('facebook', { session: false }, (err, user: IUser, info) => {
        if (err) return next(err)

        if (user) {
            const token = generateToken(user)

            // send data back to the app/website
            // return res.redirect(`beam://auth?token=${token}`)
            return res.redirect(`${process.env.CLIENT_URL}/register?token=${token}`)
        }

        return res.status(400).send({
            error: info,
        })
    })(req, res, next)
})

router.get('/test-user-notif', async (_, res) => {
    try {
        const user = await User.findOne({ email: 'marvinkome@gmail.com' })

        // await new Promise((res) => setTimeout(res, 2000))

        await messaging().send({
            token: user?.notificationToken || '',
            webpush: {
                notification: {
                    title: 'Lenny',
                    body: "How's notifications coming up? How close are we do being done?",
                    icon: user?.profile.picture || '',
                    badge: 'http://localhost:3000/notif-logo.png',
                },
                fcmOptions: {
                    link: 'http://localhost:3000/app/chats',
                },
            },
        })

        res.send('done')
    } catch (e) {
        console.log(e.message)
        res.send('error')
    }
})

export default router
