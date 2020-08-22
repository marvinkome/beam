import React from "react"
import "./style.scss"
import { FaSearch, FaPlus, FaPaintBrush } from "react-icons/fa"
import { Collapsible } from "components/collapsible"

export function JoinGroups(props: { changeStep: () => void }) {
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
                />
            </label>

            {/* existing groups */}
            <Collapsible
                defaultValue={true}
                className="groups-card"
                header={
                    <div>
                        <p>Current groups in your location</p>
                        <span>10 groups near you</span>
                    </div>
                }
            >
                <div className="group">
                    <div className="group-details">
                        <img src={require("assets/images/beambot.png")} alt="Group" />

                        <div>
                            <p>Kurzgesagt Lagos</p>
                            <span>Click to peak inside</span>
                        </div>
                    </div>

                    <div className="group-action">
                        <button className="btn btn-primary-outline">
                            <FaPlus className="icon" /> Join
                        </button>
                    </div>
                </div>

                <div className="group">
                    <div className="group-details">
                        <img src={require("assets/images/beambot.png")} alt="Group" />

                        <div>
                            <p>Kurzgesagt Lagos</p>
                            <span>Click to peak inside</span>
                        </div>
                    </div>

                    <div className="group-action">
                        <button className="btn btn-primary-outline">
                            <FaPlus className="icon" /> Join
                        </button>
                    </div>
                </div>
            </Collapsible>

            {/* non-existing groups */}
            <Collapsible
                defaultValue={true}
                className="groups-card"
                header={
                    <div>
                        <p>Create a group for your location</p>
                        <span>12 groups doesn't exist</span>
                    </div>
                }
            >
                <div className="group">
                    <div className="group-details">
                        <img src={require("assets/images/beambot.png")} alt="Group" />

                        <div>
                            <p>Powerful JRE Lagos</p>
                        </div>
                    </div>

                    <div className="group-action">
                        <button className="btn btn-primary-outline">
                            <FaPaintBrush className="icon" /> Create
                        </button>
                    </div>
                </div>
            </Collapsible>
        </div>
    )
}
