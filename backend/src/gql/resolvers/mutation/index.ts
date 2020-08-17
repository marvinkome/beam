import { resolver as authResolvers } from './auth'
import { resolvers as userResolvers } from './users'
import { resolvers as messageResolvers } from './message'

export const mutationResolvers = {
    Mutation: {
        ...authResolvers,
        ...userResolvers,
        ...messageResolvers,
    },
}
