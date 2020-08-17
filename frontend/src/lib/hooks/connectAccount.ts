import { useMutation, gql } from "@apollo/client"

export default function useConnectAccount() {
    const [connectAccount] = useMutation(gql`
        mutation ConnectAccount($input: ConnectAccountInput) {
            connectAccount(input: $input)
        }
    `)

    return connectAccount
}
