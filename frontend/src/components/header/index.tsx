import React from "react"
import cls from "classnames"
import { useDropdown } from "hooks"
import { useQuery, gql } from "@apollo/client"
import { FiArrowLeft } from "react-icons/fi"
import { useHistory, Link } from "react-router-dom"
import { AddFriend, ShareBeam } from "components/modals"
import "./style.scss"

export function RootHeader() {
    const { dropdownOpen, toggleDropdown } = useDropdown()
    const { data } = useQuery(gql`
        query Me {
            me {
                id
                profile {
                    picture
                }
            }
        }
    `)

    return (
        <header className="root-header">
            <img alt="Beam logo" className="logo" src={require("assets/images/beam-logo.png")} />

            <img alt="me" onClick={toggleDropdown} className="me" src={data?.me.profile.picture} />

            <div className={cls("dropdown-container", { isOpen: dropdownOpen })}>
                <div className="dropdown">
                    <AddFriend
                        modalLocation="header"
                        trigger={(toggle) => <p onClick={toggle}>Add a friend to Beam</p>}
                    />
                    <Link to="/app/join-group">Join a group</Link>
                    <Link to="/app/find-friend">Find me a friend</Link>
                    <Link to="/app/profile">Profile settings</Link>
                    <ShareBeam
                        modalLocation="header"
                        trigger={(toggle) => (
                            <p className="text-link" onClick={toggle}>
                                Click here to tell others about Beam
                            </p>
                        )}
                    />
                </div>
            </div>
        </header>
    )
}

export function StackHeader(props: { title: string }) {
    const history = useHistory()
    return (
        <header className="stack-header">
            <FiArrowLeft onClick={() => history.goBack()} className="icon" />
            <p>{props.title}</p>
        </header>
    )
}
