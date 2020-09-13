import { resolver as authResolvers } from './auth'
import { resolvers as userResolvers } from './users'
import { resolvers as messageResolvers } from './message'
import { resolvers as groupResolvers } from './groups'

export const mutationResolvers = {
    Mutation: {
        ...authResolvers,
        ...userResolvers,
        ...messageResolvers,
        ...groupResolvers,
    },
}
