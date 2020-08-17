import { gql } from 'apollo-server-express'

export const subscriptionTypeDef = gql`
    type Subscription {
        messageSent(friendId: ID!): Message
        lastSeen(friendId: ID!): String
    }
`
