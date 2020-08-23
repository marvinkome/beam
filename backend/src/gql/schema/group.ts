import { gql } from 'apollo-server-express'

export const groupTypeDefs = gql`
    type Group {
        id: String
        name: String
        image: String
        interest: String
        location: String
        users: [User]
    }
`
