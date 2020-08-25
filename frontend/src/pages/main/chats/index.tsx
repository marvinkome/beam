import React, { useState } from "react"
import cls from "classnames"
import { FriendsTab } from "./friends"
import { GroupsTab } from "./groups"
import { RootHeader } from "components/header"
import "./style.scss"

function useTabs() {
    const [currentTab, changeCurrentTab] = useState<"groups" | "friends">("groups")

    return {
        currentTab,
        changeTab: (tab: "groups" | "friends") => {
            changeCurrentTab(tab)
        },
    }
}

export function Chats() {
    const { currentTab, changeTab } = useTabs()

    return (
        <div className="chats-page">
            <RootHeader />

            {/* friends */}
            {currentTab === "friends" && <FriendsTab />}

            {/* groups */}
            {currentTab === "groups" && <GroupsTab />}

            {/* bottom bar */}
            <div className="bottom-nav">
                <div
                    onClick={() => changeTab("groups")}
                    className={cls("nav-content", { active: currentTab === "groups" })}
                >
                    Groups
                </div>

                <div
                    onClick={() => changeTab("friends")}
                    className={cls("nav-content", { active: currentTab === "friends" })}
                >
                    Friends
                </div>
            </div>
        </div>
    )
}
