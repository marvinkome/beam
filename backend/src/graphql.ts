import e from 'express'
import {
    makeExecutableSchema,
    ApolloServer,
    ApolloServerExpressConfig,
    PubSub,
    Config,
} from 'apollo-server-express'

// types and resolvers
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { getTokenFromHeaders, getUserFromToken } from '@libs/auth'
import { IUser } from '@models/users'

// PUBSUB
export const pubsub = new PubSub()

// SCHEMA
const schema = makeExecutableSchema({ typeDefs, resolvers })

// CONTEXT
export interface IContext {
    currentUser: IUser | null
    req: e.Request<any>
    res: e.Response<any>
}
const context: ApolloServerExpressConfig['context'] = async (ctx): Promise<IContext> => {
    if (ctx.connection) {
        return { ...ctx.connection.context }
    }

    const authToken = getTokenFromHeaders(ctx.req)
    const currentUser = await getUserFromToken(authToken || '')

    return {
        req: ctx.req,
        res: ctx.res,
        currentUser,
    }
}

// SUBSCRIPTION
const subscriptions: Config['subscriptions'] = {
    onConnect: async (connectionParams: any) => {
        if (!connectionParams.authToken) {
            return {}
        }

        const currentUser = await getUserFromToken(connectionParams.authToken || '')

        if (currentUser) {
            currentUser.lastSeen = null

            await currentUser.save()
            await pubsub.publish('USER_CONNECTED', {
                lastSeen: null,
                userId: currentUser.id,
            })
        }

        return { currentUser }
    },

    onDisconnect: async (_: any, ctx) => {
        const initPromise = await ctx.initPromise
        if (!initPromise.currentUser) return

        const date = new Date()
        initPromise.currentUser.lastSeen = date

        await initPromise.currentUser.save()
        await pubsub.publish('USER_CONNECTED', {
            lastSeen: date,
            userId: initPromise.currentUser.id,
        })
    },
}

const apolloServer = new ApolloServer({ schema, context, subscriptions })
export default apolloServer
