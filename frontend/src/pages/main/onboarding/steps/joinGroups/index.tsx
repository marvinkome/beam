import React, { useState, useEffect } from "react"
import partition from "lodash.partition"
import { toast } from "react-toastify"
import { useQuery, gql, useMutation } from "@apollo/client"
import { FaSearch, FaPlus, FaPaintBrush } from "react-icons/fa"
import { Collapsible } from "components/collapsible"
import "./style.scss"

function splitInterestsIntoGroups(interests: any[]) {
    return partition(interests, (o) => o.group !== null)
}

function useDataSource(interests: any[]) {
    const [data, setData] = useState(interests)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!searchTerm.length) {
            setData(interests)
        } else {
            setData(
                interests.filter((interest) => {
                    const lcaseInterestName = (interest.name as string).toLowerCase()
                    return lcaseInterestName.startsWith(searchTerm)
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

function useInterests() {
    const { data, loading } = useQuery(gql`
        {
            me {
                profile {
                    location {
                        state
                    }
                }
                interests {
                    id
                    name
                    image
                    group {
                        id
                        name
                        image
                    }
                }
            }
        }
    `)

    return {
        interests: data?.me?.interests,
        location: data?.me?.profile?.location?.state,
        loading,
    }
}

function useCreateGroup() {
    const [createGroupFn] = useMutation(gql`
        mutation CreateGroup($interestId: ID!) {
            createGroup(interestId: $interestId) {
                success
                message
            }
        }
    `)

    return async (interestId: string) => {
        const { data } = await createGroupFn({ variables: { interestId } })
        if (!data?.createGroup.success) {
            return toast.dark(data?.createGroup.message)
        }

        // redirect to group
        toast.dark("Group created")
    }
}

function useJoinGroup() {
    const [joinGroupFn] = useMutation(gql`
        mutation JoinGroup($groupId: ID!) {
            joinGroup(groupId: $groupId) {
                success
                message
            }
        }
    `)

    return async (groupId: string) => {
        const { data } = await joinGroupFn({ variables: { groupId } })
        if (!data?.joinGroup.success) {
            return toast.dark(data?.joinGroup.message)
        }

        // redirect to group
        toast.dark("Joined group")
    }
}

export function JoinGroups(props: { changeStep: () => void }) {
    // query
    const { interests, location, loading } = useInterests()
    const { onSearch, data, isSearching } = useDataSource(interests || [])
    const [existingGroups, nonExistingGroups] = data

    // mutations
    const createGroup = useCreateGroup()
    const joinGroup = useJoinGroup()

    return (
        <div className="join-groups">
            <h1>Join Groups</h1>

            {/* search bar */}
            <label className="form-label" htmlFor="search">
                <FaSearch className="icon" />
                <input
                    id="search"
                    type="text"
                    className="form-input"
                    placeholder="Search for a group"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </label>

            {/* loader */}
            {loading && (
                <div className="loading">
                    <p>Please wait while we look for groups in your location</p>

                    <div className="loader" />
                </div>
            )}

            {/* if they're no groups to join */}
            {!existingGroups.length && !loading && (
                <p className="no-group">
                    {isSearching
                        ? "There are no groups in your location that match your search."
                        : "There are currently no groups in your location that match your interests."}
                </p>
            )}

            {/* existing groups */}
            {!!existingGroups.length && (
                <Collapsible
                    defaultIsOpen={true}
                    className="groups-card"
                    header={
                        <div>
                            <p>Current groups in your location</p>
                            <span>{existingGroups.length} groups near you</span>
                        </div>
                    }
                >
                    {existingGroups.map((interest) => (
                        <div key={interest.group.id} className="group">
                            <div className="group-details">
                                <img
                                    src={
                                        interest.group.image || require("assets/images/beambot.png")
                                    }
                                    alt="Group"
                                />

                                <div>
                                    <p>{interest.group.name}</p>
                                    <span>click to preview</span>
                                </div>
                            </div>

                            <div className="group-action">
                                <button
                                    onClick={() => joinGroup(interest.group.id)}
                                    className="btn btn-primary-outline"
                                >
                                    <FaPlus className="icon" /> Join
                                </button>
                            </div>
                        </div>
                    ))}
                </Collapsible>
            )}

            {/* non-existing groups */}
            {!!nonExistingGroups.length && (
                <Collapsible
                    defaultIsOpen={!existingGroups.length}
                    className="groups-card"
                    header={
                        <div>
                            <p>Create a group for your location</p>
                            <span>{nonExistingGroups.length} groups doesn't exist</span>
                        </div>
                    }
                >
                    {nonExistingGroups.slice(0, 10).map((interest) => (
                        <div key={interest.id} className="group">
                            <div className="group-details">
                                <img
                                    src={interest.image || require("assets/images/beambot.png")}
                                    alt="Group"
                                />

                                <div>
                                    <p title={`{interest.name} Lagos`}>{interest.name}</p>
                                    <span>{location}</span>
                                </div>
                            </div>

                            <div className="group-action">
                                <button
                                    onClick={() => createGroup(interest.id)}
                                    className="btn btn-primary-outline"
                                >
                                    <FaPaintBrush className="icon" /> Create
                                </button>
                            </div>
                        </div>
                    ))}
                </Collapsible>
            )}
        </div>
    )
}
