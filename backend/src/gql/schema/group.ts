import { gql } from 'apollo-server-express'

export const groupTypeDefs = gql`
    type Role {
        name: String
    }

    type GroupUser {
        user: User
        role: Role
    }

    type Group {
        id: String
        name: String
        image: String
        interest: String
        location: String
        users: [GroupUser]

        isMember: Boolean
        lastMessage: Message
        messages(first: Int, after: Int): [Message]
    }
`
