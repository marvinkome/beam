import { gql } from 'apollo-server-express'

export const messageTypeDefs = gql`
    type Message {
        id: ID!
        message: String
        timestamp: String
        from: User
        to: User
    }
`
