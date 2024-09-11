import config from "../../config"
import { chat } from "../../utils/utils"

let lastCompleted = [0, 7]
let gateBlown = false
let phaseStarted = null
let sectionStarted = null

const newSection = () => {
    sectionStarted = Date.now()
    gateBlown = false
    lastCompleted = [0, 7]
}

const trigger = register("chat", () => {
    if (config().terminalTimestamps)
    phaseStarted = Date.now()
    sectionStarted = Date.now()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?").unregister();

const phaseTrigger = register("chat", (name, action, object, completed, total, event) => {
    if (config().terminalTimestamps && phaseStarted)
    completed = parseInt(completed)
    total = parseInt(total)
    let timeSection = ((Date.now() - sectionStarted) / 1000).toFixed(2)
    let timePhase = ((Date.now() - phaseStarted) / 1000).toFixed(2)
    let message = ChatLib.getChatMessage(event, true)
    let formattedName = message.substring(0, name.length + 6)
    cancel(event)
    ChatLib.chat(`${formattedName} &a${action} ${object}! (&c${completed}&a/${total}) &8(&7${timeSection}s &8| &7${timePhase}s&8)`)
    if (completed < lastCompleted[0] || (completed == total && gateBlown)) return newSection()
    lastCompleted = [completed, total]
}).setCriteria(/(\w+) (activated|completed) (a terminal|a device|a lever)! \((\d)\/(\d)\)/).unregister();

const gateTrigger = register("chat", (event) => {
    if (!(config().terminalTimestamps && phaseStarted)) return
    let timeSection = ((Date.now() - sectionStarted) / 1000).toFixed(2)
    let timePhase = ((Date.now() - phaseStarted) / 1000).toFixed(2)
    cancel(event)
    ChatLib.chat(`&aThe gate has been destroyed! &8(&7${timeSection}s &8| &7${timePhase}s&8)`)
    if (lastCompleted[0] == lastCompleted[1]) newSection()
    else gateBlown = true
}).setCriteria("The gate has been destroyed!").unregister();

const eventTrigger = register ("chat", (event) => {
    if (config().terminalTimestamps)
    phaseStarted = null
    sectionStarted = null
}).setCriteria("The Core entrance is opening!").unregister();

const worldTrigger = register("worldLoad", () => {
    lastCompleted = [0, 7]
    gateBlown = false
    phaseStarted = null
    sectionStarted = null
}).unregister();

export function toggle() {
    if (config().bossToggle && config().toggle && config().terminalTimers) {
        if (config().debug) chat("&aStarting the &6Terminal Timestamps &amodule.")
            trigger.register()
            phaseTrigger.register()
            gateTrigger.register()
            eventTrigger.register()
            worldTrigger.register()
            return
    }
    if (config().debug) chat("&cStopping the &6Terminal Timestamps &cmodule.")
        trigger.unregister()
        phaseTrigger.unregister()
        gateTrigger.unregister()
        eventTrigger.unregister()
        worldTrigger.unregister()
        return
}
export default { toggle };