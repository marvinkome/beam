import { google } from 'googleapis'
import { Router } from 'express'

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

export default router
