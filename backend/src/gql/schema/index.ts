import { queryTypeDef } from './query'
import { mutationTypeDefs } from './mutation'
import { userTypeDefs } from './user'
import { messageTypeDefs } from './message'
import { subscriptionTypeDef } from './subscription'

export const typeDefs = [
    queryTypeDef,
    mutationTypeDefs,
    userTypeDefs,
    messageTypeDefs,
    subscriptionTypeDef,
]
