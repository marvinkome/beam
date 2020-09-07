import partition from "lodash.partition"
import { useQuery, gql, useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { trackEvent } from "lib/analytics"

function splitInterestsIntoGroups(interests: any[]) {
    return partition(interests, (o) => o.group !== null)
}

export function useInterestsAndLocation() {
    const { data, loading } = useQuery(
        gql`
            {
                me {
                    id
                    profile {
                        location {
                            state
                        }
                    }
                    interests {
                        id
                        name
                        image
                        platform
                        group {
                            id
                            name
                            image
                        }
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    return {
        interests: data?.me?.interests,
        location: data?.me?.profile?.location?.state,
        loading,
    }
}

export function useDataSource(interests: any[]) {
    const [data, setData] = useState(interests)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!searchTerm.length) {
            setData(interests)
        } else {
            setData(
                interests.filter((interest) => {
                    const lcaseInterestName = (interest.name as string).toLowerCase()
                    return lcaseInterestName.startsWith(searchTerm.toLowerCase())
                })
            )
        }
    }, [searchTerm, interests])

    return {
        onSearch: (term: string) => setSearchTerm(term),
        isSearching: !!searchTerm.length,
        data: splitInterestsIntoGroups(data),
    }
}

export function useGroupsPagination(data: any[]) {
    const steps = 30
    const [currentChunk, setCurrentChunk] = useState(0) // store current chunk

    return {
        data: data.slice(0, (currentChunk + 1) * steps),
        hasMore: (currentChunk + 1) * steps < data.length,
        loadMore: () => {
            if ((currentChunk + 1) * steps < data.length) {
                setCurrentChunk(currentChunk + 1)
            }
        },
    }
}

export function useCreateGroup(onCreateGroup: (group?: any) => void) {
    const [createGroupFn] = useMutation(gql`
        mutation CreateGroup($interestId: ID!) {
            createGroup(interestId: $interestId) {
                success
                message
                group {
                    id
                }
            }
        }
    `)

    return async (interestId: string) => {
        const { data } = await createGroupFn({ variables: { interestId } })
        if (!data?.createGroup.success) {
            return toast.dark(data?.createGroup.message)
        }

        trackEvent("Create group", { category: "Group" })
        onCreateGroup(data?.createGroup.group)
    }
}

export function useJoinGroup(onJoinGroup: (group?: any) => void) {
    const [joinGroupFn] = useMutation(gql`
        mutation JoinGroup($groupId: ID!) {
            joinGroup(groupId: $groupId) {
                success
                message
                group {
                    id
                }
            }
        }
    `)

    return async (groupId: string) => {
        const { data } = await joinGroupFn({ variables: { groupId } })
        if (!data?.joinGroup.success) {
            return toast.dark(data?.joinGroup.message)
        }

        trackEvent("Join group", { category: "Group" })
        onJoinGroup(data?.joinGroup.group)
    }
}

export function useLeaveGroup(onLeaveGroup: () => void) {
    const [leaveGroupFn] = useMutation(gql`
        mutation LeaveGroup($groupId: ID!) {
            leaveGroup(groupId: $groupId)
        }
    `)

    return async (groupId: string) => {
        const { data } = await leaveGroupFn({ variables: { groupId } })
        if (!data?.leaveGroup) {
            return toast.dark("Error leaving group")
        }

        trackEvent("Leave group", { category: "Group" })
        onLeaveGroup()
    }
}
