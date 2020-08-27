importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js")

const config = {
    apiKey: "AIzaSyD9JlFL4YgjcH-gvWHNA0XtqjYSWYlJmZk",
    projectId: "beam-abf91",
    messagingSenderId: "980384508798",
    appId: "1:980384508798:web:e549ef0c1eceb3fabde12f",
}

firebase.initializeApp(config)
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload)

    // create and send notification
    const notificationTitle = payload.data.title
    const notificationOptions = {
        body: payload.data.message,
        icon: payload.data.image || "/logo512.png",
        data: { type: payload.data.type, id: payload.data.id },
    }

    return self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener("notificationclick", (event) => {
    event.notification.close()
    console.log("[firebase-messaging-sw.js] Notification clicked", event)

    const notificationData = event.notification.data
    if (notificationData && notificationData.type === "group") {
        event.waitUntil(clients.matchAll({ type: "window" })).then((clients) => {
            console.log("client", clients)
        })

        // client.matchAll().then((clients) => {
        //     const url = new URL("/", location).href
        //     console.log(url)

        //     for (let matchClient of matchedClients) {
        //         if (matchClient.url.startsWith(url)) {
        //             return matchClient.focus()
        //         }
        //     }
        //     return clients.openWindow(url)
        // })
        // window.location.href = "/app/group" + notificationData.id
    }
    return event
})
