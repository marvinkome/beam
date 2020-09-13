import { gql } from 'apollo-server-express'

export const conversationTypeDef = gql`
    type Conversation {
        id: ID!
        lastViewed: String
        messages(first: Int, sort: Boolean, after: Int): [Message]
    }
`
