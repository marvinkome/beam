import { resolver as authResolvers } from './auth'
import { resolvers as userResolvers } from './users'
import { resolvers as messageResolvers } from './message'
import { resolvers as groupResolvers } from './groups'
import { resolvers as chatResolvers } from './chats'

export const mutationResolvers = {
    Mutation: {
        ...authResolvers,
        ...userResolvers,
        ...messageResolvers,
        ...groupResolvers,
        ...chatResolvers,
    },
}
