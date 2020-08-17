import express from 'express'
import path from 'path'
import { createServer } from 'http'
import { connect } from 'mongoose'
import bodyParser from 'body-parser'

import apolloServer from '@gql/index'
import setupStrategies from '@libs/strategies'
import authRoutes from '@routes/auth'
import connectRoutes from '@routes/connect'

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

    // api routes
    app.use('/auth', authRoutes)
    app.use('/connect', connectRoutes)

    app.get('/', (_, res) => res.json({ message: 'welcome to beam' }))
    app.use('*', (_, res) => res.send('404 page not found'))

    const server = createServer(app)
    apolloServer.installSubscriptionHandlers(server)

    return { server, apolloServer }
}
