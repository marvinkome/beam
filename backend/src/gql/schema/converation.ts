import { gql } from 'apollo-server-express'

export const conversationTypeDef = gql`
    type Conversation {
        id: ID!
        messages(first: Int, sort: Boolean, after: Int): [Message]
    }
`
