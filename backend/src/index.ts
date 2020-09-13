import express from 'express'
import path from 'path'
import admin from 'firebase-admin'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { connect } from 'mongoose'

import apolloServer from 'src/graphql'
import setupStrategies from '@libs/strategies'
import authRoutes from '@routes/auth'

export default function createApp() {
    const app = express()

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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount =
        process.env.NODE_ENV === 'production'
            ? require('/opt/firebase/firebase_secret.json')
            : require('../firebase_secret.json')

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })

    // api routes
    app.use('/auth', authRoutes)

    app.get('/', (_, res) => res.json({ message: 'welcome to beam' }))
    app.use('*', (_, res) => res.send('404 page not found'))

    const server = createServer(app)
    apolloServer.installSubscriptionHandlers(server)

    return { server, apolloServer }
}
