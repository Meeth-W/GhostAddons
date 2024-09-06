import config from "../../config"
import { chat, isInBoss } from "../../utils/utils"

const mainTrigger = register("chat", (name) => {
    if (!config().leapAnnounce) return
    if (!isInBoss()) return
    ChatLib.command(`pc Leaped to ${name}!`)
}).setCriteria("You have teleported to ${name}!").unregister();

const trigger = register('chat', (from, to, event) => {
    if (config().hideLeap == 1 && from == Player.getName()) cancel(event)
    if (config().hideLeap == 2 && to != Player.getName()) cancel(event)
    if (config().hideLeap == 3) cancel(event)
}).setCriteria(/Party > (?:\[.+\])? ?(.+) ?[ቾ⚒]?: Leaped to (\S+)!?/).unregister();

export function toggle() {
    if (config().bossToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Leap Announce &amodule.")
        mainTrigger.register()
        trigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Leap Announce &cmodule.")
        mainTrigger.unregister()
        trigger.unregister()
        return
}
export default { toggle };