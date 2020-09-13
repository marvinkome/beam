import { gql } from 'apollo-server-express'

export const messageTypeDefs = gql`
    union MessageTo = User | Group
    type Message {
        id: ID!
        message: String
        timestamp: String
        from: User
        to: MessageTo
    }
`
