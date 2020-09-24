import express from 'express'
import path from 'path'
import admin from 'firebase-admin'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { connect } from 'mongoose'

import apolloServer from 'src/graphql'
import setupStrategies from '@libs/strategies'
import authRoutes from '@routes/auth'
import testRoutes from '@routes/test'

const serviceAccount = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('/opt/firebase/firebase_secret.json')
        case 'development':
            return require('../firebase_secret.json')
        case 'staging': {
            return {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }
        }
    }
}

export default function createApp() {
    const app = express()

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@cypress/code-coverage/middleware/express')(app)

    // setup mongoose
    connect(process.env.DB_URL || '', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })

    // body parser
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    // static files
    app.use(express.static(path.join(__dirname, 'public')))

    // setup graphql
    apolloServer.applyMiddleware({ app })

    // setup passport
    setupStrategies()

    // setup firebase
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount()),
    })

    // api routes
    app.use('/auth', authRoutes)
    if (process.env.NODE_ENV === 'staging') {
        app.use('/test', testRoutes)
    }

    app.get('/', (_, res) => res.json({ message: 'welcome to beam' }))
    app.use('*', (_, res) => res.send('404 page not found'))

    const server = createServer(app)
    apolloServer.installSubscriptionHandlers(server)

    return { server, apolloServer }
}
