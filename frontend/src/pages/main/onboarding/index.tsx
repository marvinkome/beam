import React from "react"
import { FaSearch, FaPlus, FaPaintBrush, FaChevronDown } from "react-icons/fa"
import { Collapsible } from "components/collapsible"
import { useHistory, Link } from "react-router-dom"
import {
    useInterestsAndLocation,
    useDataSource,
    useGroupsPagination,
    useCreateGroup,
    useJoinGroup,
} from "hooks/groups"
import { ONBOARDING_KEY } from "lib/keys"

import "./style.scss"

export function OnBoarding() {
    const history = useHistory()

    // query
    const { interests, location, loading } = useInterestsAndLocation()
    const { onSearch, data, isSearching } = useDataSource(interests || [])
    const [existingGroups, nonExistingGroupsRaw] = data

    // add pagination for new groups
    const { data: nonExistingGroups, loadMore, hasMore } = useGroupsPagination(nonExistingGroupsRaw)

    // mutations
    const createGroup = useCreateGroup((group) => {
        localStorage.setItem(ONBOARDING_KEY, "true")
        history.push(`/app/group/${group?.id}`)
    })

    const joinGroup = useJoinGroup((group) => {
        localStorage.setItem(ONBOARDING_KEY, "true")
        history.push(`/app/group/${group?.id}`)
    })

    return (
        <div className="onboarding-page">
            <header>
                <h1>Join Groups</h1>
                <p>Join or create groups near you based on your interests</p>
            </header>

            {/* search bar */}
            <label className="form-label" htmlFor="search">
                <FaSearch className="icon" />
                <input
                    id="search"
                    type="text"
                    className="form-input"
                    placeholder="Search for more groups"
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
            {!!nonExistingGroupsRaw.length && (
                <Collapsible
                    defaultIsOpen={!existingGroups.length}
                    className="groups-card"
                    header={
                        <div>
                            <p>Create a group for your location</p>
                            <span>{nonExistingGroupsRaw.length} groups doesn't exist</span>
                        </div>
                    }
                >
                    <>
                        {nonExistingGroups.map((interest) => (
                            <div key={interest.id} className="group">
                                <div className="group-details">
                                    <img
                                        src={interest.image || require("assets/images/beambot.png")}
                                        alt="Group"
                                    />

                                    <div>
                                        <p>
                                            {interest.platform === "reddit" && "r/"}
                                            {interest.name}
                                        </p>
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

                        {hasMore && (
                            <p onClick={loadMore}>
                                View more <FaChevronDown className="icon" />
                            </p>
                        )}
                    </>
                </Collapsible>
            )}
        </div>
    )
}
