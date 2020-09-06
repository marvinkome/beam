import passport from 'passport'
import { Router } from 'express'
import { generateToken } from '@libs/auth'
import { IUser } from '@models/users'
import { sendJoinGroupEmail, sendNewMessageEmail, sendInviteEmail } from '@libs/emails'

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

router.get('/test-email', async (_, res) => {
    await sendJoinGroupEmail({
        to: ['marvinkome@gmail.com', 'lennyjohnson291@gmail.com'],
        data: {
            memberName: 'Lenny',
            groupName: 'Kurzgesagt - In a nutshell - Lagos',
            groupId: '0i90v',
        },
    })

    await sendNewMessageEmail({
        to: 'marvinkome@gmail.com',
        data: {
            message: 'Hey man, just testing if this works out',
            friendName: 'Lenny',
            friendId: '0i90v',
        },
    })

    await sendInviteEmail({
        to: 'marvinkome@gmail.com',
        data: {
            matchName: 'Lenny',
            interestsCount: 24,
        },
    })

    res.send('done')
})

export default router
