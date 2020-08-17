import React from "react"
import ReactDOM from "react-dom"
import { RootPage } from "pages"
import * as serviceWorker from "lib/serviceWorker"

import "intro.js/introjs.css"
import "styles/index.scss"

ReactDOM.render(<RootPage />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
