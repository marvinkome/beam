import moment, { Moment } from "moment"
import { FACEBOOK_ID, ONBOARDING_KEY } from "./keys"

export function checkForConnectedAccounts(connectedAccounts: any) {
    if (connectedAccounts) {
        const hasConnectedAccount = Object.keys(connectedAccounts)
            .filter((item) => item !== "__typename")
            .some((item) => connectedAccounts[item])

        return hasConnectedAccount
    }

    return false
}

export function toQuery(params: any, delimiter = "&") {
    const keys = Object.keys(params)

    return keys.reduce((str, key, index) => {
        let query = `${str}${key}=${params[key]}`

        if (index < keys.length - 1) {
            query += delimiter
        }

        return query
    }, "")
}

export function toParams(query: string) {
    const q = query.replace(/^\??\//, "")

    return q.split("&").reduce((values: any, param) => {
        const [key, value] = param.split("=")

        values[key] = value

        return values
    }, {})
}

export function formatDate(date: any, full?: boolean) {
    const currDate = moment()
    const myDate = moment(parseInt(date, 10))
    const today = currDate.clone().startOf("day")
    const yday = currDate.clone().subtract(1, "days").startOf("day")

    function isToday(mdate: Moment) {
        return mdate.isSame(today, "d")
    }

    function isYesterday(mdate: Moment) {
        return mdate.isSame(yday, "d")
    }

    if (isToday(myDate)) {
        return full ? myDate.format("[today at] LT") : myDate.format("h:mm A")
    }

    if (isYesterday(myDate)) {
        return full ? myDate.format("[yesterday at] LT") : "Yesterday"
    }

    return full ? myDate.format("D MMM YYYY LT") : myDate.format("D[/]M[/]YY")
}

export function shareUrl(link: string, firstName?: string, invite?: boolean) {
    return {
        messenger: `fb-messenger://share?link=${encodeURIComponent(
            link
        )}&app_id=${encodeURIComponent(FACEBOOK_ID)}`,

        whatsapp: `https://wa.me/?text=${
            invite
                ? encodeURIComponent(`${firstName} sent you a Beam invite, click ${link}`)
                : encodeURIComponent(`Hey you should check out ${link}. It's the future.`)
        }`,

        twitter: `http://twitter.com/share?text=${
            invite
                ? encodeURIComponent(`${firstName} sent you a Beam invite, click ${link}`)
                : encodeURIComponent(`Hey you should check out Beam. It's the future.`)
        }&url=${link}&hashtags=social,beam,socialmedia`,
    }
}

export function isMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ]

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem)
    })
}

export function getProfileImage(profile: any) {
    if (profile?.picture === null) {
        return require("assets/images/beambot.png")
    }

    return profile?.picture
}

export function redirectUri() {
    if (localStorage.getItem(ONBOARDING_KEY) === "true") {
        return "/app/chats"
    } else {
        return "/app/onboarding"
    }
}

export function getGeolocation() {
    return new Promise((res: (location: any) => void, rej: (reason?: string) => void) => {
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(
                (position) => {
                    res({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    })
                },
                (err) => {
                    rej(err.message)
                },
                {
                    enableHighAccuracy: true,
                }
            )
        } else {
            rej("Navigation not supported")
        }
    })
}
