import config from "../../config"
import { chat, getClass } from "../../utils/utils"

let inPre4 = false

const berstrigger = register("chat", () => {
    if (config().pre4Disable)
    if (getClass() === "Berserker") inPre4 = true
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?").unregister()

const pre4trigger = register("chat", () => {
    if (inPre4)
    inPre4 = false
}).setCriteria(/.+ completed a device! .+/).unregister()

const bonzo1trigger = register("chat", () => {
    if (config().invincibilityMsg && !inPre4)
    ChatLib.command("pc " + config().maskText);
}).setCriteria(/Your (⚚)? Bonzo's Mask saved your life!/).unregister()

const bonzo2trigger = register("chat", () => {
    if (config().invincibilityMsg && !inPre4)
    ChatLib.command("pc " + config().maskText);
}).setCriteria(/Your Bonzo's Mask saved your life!/).unregister()

const phoenixtrigger = register("chat", () => {
    if (config().invincibilityMsg && !inPre4)
    ChatLib.command("pc " + config().phoenixText);
}).setCriteria("Your Phoenix Pet saved you from certain death!").unregister()

export function toggle() {
    if (config().invincibilityToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Invincibility Messages &amodule.")
        berstrigger.register()
        pre4trigger.register()
        bonzo1trigger.register()
        bonzo2trigger.register()
        phoenixtrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Invincibility Messages &cmodule.")
        berstrigger.unregister()
        pre4trigger.unregister()
        bonzo1trigger.unregister()
        bonzo2trigger.unregister()
        phoenixtrigger.unregister()
        return
}
export default { toggle };