import { useEffect } from "react"
import introJs from "intro.js"

export function useIntroJs(options: { key: string; start: boolean; steps: any[] }) {
    useEffect(() => {
        if (window.localStorage.getItem(options.key)) {
            return undefined
        }

        const intro = introJs()

        intro.onbeforechange(() => {
            // @ts-ignore
            const currentStepIdx = intro._currentStep

            // @ts-ignore
            const currentStepDynamic = !!intro._options.steps[currentStepIdx].dynamic

            if (currentStepDynamic) {
                // @ts-ignore
                const step = intro._options.steps[currentStepIdx]
                const element = document.querySelector(step.element)

                if (element) {
                    // @ts-ignore
                    const introItem = intro._introItems[currentStepIdx]
                    introItem.element = element
                    introItem.position = step.position
                }
            }
        })

        intro.onexit(() => {
            window.localStorage.setItem(options.key, "true")
        })

        intro.oncomplete(() => {
            window.localStorage.setItem(options.key, "true")
        })

        intro.setOptions({ steps: options.steps })

        if (options.start) {
            intro.start()
        }
    }, [options])
}
