/// <reference types="cypress" />
const fs = require("fs")

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    // code coverage
    require("@cypress/code-coverage/task")(on, config)

    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    on("task", {
        readFileMaybe(filename) {
            if (fs.existsSync(filename)) {
                return fs.readFileSync(filename, "utf8")
            }

            return null
        },
    })

    return config
}
