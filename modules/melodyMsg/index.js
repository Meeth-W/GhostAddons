import config from "../../config"
import { chat, isInP3 } from "../../utils/utils"


const guiTrigger = register('guiOpened', () => {
    if (!isInP3()) return
    Client.scheduleTask(2, () => {
        if (Player?.getContainer()?.getName() != 'Click the button on time!') return
        claySlots = new Map([
            [25, `pc ${config().melodyText} 1/4`],
            [34, `pc ${config().melodyText} 2/4`],
            [43, `pc ${config().melodyText} 3/4`]
        ])
        if (!config().announceMelody) return
        ChatLib.command(`pc ${config().melodyText}`)
    })
}).unregister();

let claySlots = new Map([
    [25, `pc ${config().melodyText} 1/4`],
    [34, `pc ${config().melodyText} 2/4`],
    [43, `pc ${config().melodyText} 3/4`]
])

const trigger = register('step', () => {
    if (!isInP3() || Player?.getContainer()?.getName() != 'Click the button on time!' || !config().melodyProgress) return

    let greenClays = Array.from(claySlots.keys()).filter(index => Player?.getContainer()?.getItems()[index]?.getMetadata() == 5)
    if (!greenClays.length) return
    
    ChatLib.command(claySlots.get(greenClays[greenClays.length - 1]))
    greenClays.forEach(clay => claySlots.delete(clay))
    greenClays = []
}).setFps(5).unregister();

export function toggle() {
    if (config().bossToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Melody Message &amodule.")
            trigger.register()
            guiTrigger.register()
            return
    }
    if (config().debug) chat("&cStopping the &6Melody Message &cmodule.")
        trigger.unregister()
        guiTrigger.unregister()
        return
}
export default { toggle };