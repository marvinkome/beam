import { google } from 'googleapis'
import { Router } from 'express'
import { messaging } from 'firebase-admin'
import Group from '@models/groups'

const router = Router()

router.get('/google', async (_, res) => {
    const clientID = process.env.GOOGLE_ID || ''
    const clientSecret = process.env.GOOGLE_SECRET || ''
    const redirectUrl = 'http://localhost:5055/connect/google/callback'

    const client = new google.auth.OAuth2(clientID, clientSecret, redirectUrl)
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    })

    return res.redirect(authUrl)
})

router.get('/google/callback', async (req, res) => {
    const accessToken = req.query.code
    console.log(accessToken)

    return res.send('done')
})

router.get('/test-group-notif', async (req, res) => {
    try {
        const group = await Group.findOne({ _id: '5f464f242dc819b813cb7b27' })

        await messaging().send({
            topic: group?.id,
            data: {
                title: group?.name || '',
                message: `Test User: This is a test message`,
                image: group?.image || '',
                type: 'group',
                id: group?.id,
            },
        })

        res.send('done')
    } catch (e) {
        console.log(e.message)
        res.send('error')
    }
})

export default router
