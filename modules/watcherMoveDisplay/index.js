import config from '../../config'
import { chat } from '../../utils/utils';

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");

const bloodStartMessages = [
    "[BOSS] The Watcher: Things feel a little more roomy now, eh?", 
    "[BOSS] The Watcher: Oh.. hello?", 
    "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", 
    "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", 
    "[BOSS] The Watcher: So you made it this far... interesting.", 
    "[BOSS] The Watcher: Ah, we meet again...", 
    "[BOSS] The Watcher: Ah, you've finally arrived.",
]

bloodStartTime = Date.now()
display = false
let bloodStartTicks

const trigger = register("chat", (message) => {
    if (!bloodStartMessages.includes(message)) return
    bloodStartTime = Date.now()
    bloodStartTicks = 0
}).setCriteria("${message}").unregister();

register('packetReceived', () => {
    bloodStartTicks++
}).setFilteredClass(S32PacketConfirmTransaction)

const mainTrigger = register("chat", () => {
    if (!config().watcherMoveDisplay) return
    let bloodMove = ((Math.floor((Date.now() - bloodStartTime)/10)/100) + 0.10).toFixed(2)
    let bloodMoveTicks = (bloodStartTicks*0.05+0.1).toFixed(2)
    let bloodMovePrediction
    let bloodMovePredictionTicks

    ChatLib.chat(`&cTime&b: &3${bloodMove} Seconds`)
    ChatLib.chat(`&cTicks&b: &3${bloodMoveTicks} &8(&7${((bloodMoveTicks)/0.05).toFixed(0)} Server Ticks&8)`)
    if (bloodMoveTicks >= 31 && bloodMoveTicks <= 33.99) bloodMovePredictionTicks = 36
    if (bloodMove >= 31 && bloodMove <= 33.99) bloodMovePrediction = 36
    if (bloodMoveTicks >= 28 && bloodMoveTicks <= 30.99) bloodMovePredictionTicks = 33
    if (bloodMove >= 28 && bloodMove <= 30.99) bloodMovePrediction = 33
    if (bloodMoveTicks >= 25 && bloodMoveTicks <= 27.99) bloodMovePredictionTicks = 30
    if (bloodMove >= 25 && bloodMove <= 27.99) bloodMovePrediction = 30
    if (bloodMoveTicks >= 22 && bloodMoveTicks <= 24.99) bloodMovePredictionTicks = 27
    if (bloodMove >= 22 && bloodMove <= 24.99) bloodMovePrediction = 27
        if (bloodMoveTicks >= 1 && bloodMoveTicks <= 21.99) bloodMovePredictionTicks = 24
    if (bloodMove >= 1 && bloodMove <= 21.99) bloodMovePrediction = 24
    if (!bloodMovePrediction) bloodMovePrediction = "Invalid Prediction"
    if (!bloodMovePredictionTicks) bloodMovePredictionTicks = "Invalid Prediction"
    ChatLib.chat(`&cMove Prediction&b: &3${bloodMovePredictionTicks} Seconds`)
    displayText = `&3${bloodMovePredictionTicks}`
    display = true
    setTimeout(() => {display = false}, 2000)
}).setCriteria("[BOSS] The Watcher: Let's see how you can handle this.").unregister();

const renderTrigger = register("renderOverlay", () => {
	if (!display || !config().watcherMoveDisplay) return
	const scale = 3
	Renderer.scale(scale)
	Renderer.drawStringWithShadow(displayText, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(displayText)) / 2, Renderer.screen.getHeight() / scale / 2 - 20)
}).unregister();

export function toggle() {
    if (config().alertToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Watcher Move Display &amodule.")
        trigger.register()
        mainTrigger.register()
        renderTrigger.register()
    return
    }
    if (config().debug) chat("&cStopping the &6Watcher Move Display &cmodule.")
        trigger.unregister()
        mainTrigger.register()
        renderTrigger.unregister()
    return
}
export default { toggle };