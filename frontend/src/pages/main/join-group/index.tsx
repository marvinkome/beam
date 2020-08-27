import React from "react"
import { Collapsible } from "components/collapsible"
import { StackHeader } from "components/header"
import { FaSearch, FaPlus, FaPaintBrush } from "react-icons/fa"
import { useHistory, Link } from "react-router-dom"
import {
    useInterestsAndLocation,
    useDataSource,
    useCreateGroup,
    useJoinGroup,
} from "lib/hooks/groups"
import "./style.scss"

export function JoinGroup() {
    const history = useHistory()

    // query
    const { interests, location, loading } = useInterestsAndLocation()
    const { onSearch, data, isSearching } = useDataSource(interests || [])
    const [existingGroups, nonExistingGroups] = data

    // mutations
    const createGroup = useCreateGroup((group) => {
        history.push(`/app/group/${group?.id}`)
    })

    const joinGroup = useJoinGroup((group) => {
        history.push(`/app/group/${group?.id}`)
    })

    return (
        <div>
            <StackHeader title="Join a group" />

            <div className="join-group-page">
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
                            : "There are no new groups in your location that match your interests"}
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
                                            interest.group.image ||
                                            require("assets/images/beambot.png")
                                        }
                                        alt="Group"
                                    />

                                    <div>
                                        <p>{interest.group.name}</p>
                                        <Link to={`/app/group/${interest.group.id}`}>
                                            click to preview
                                        </Link>
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
        </div>
    )
}
