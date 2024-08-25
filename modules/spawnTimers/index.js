import { registerWhen } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import gui_config from "../../gui_config";
import { data } from "../../utils/data";
import { chat } from "../../utils/utils";

let relicTimer = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.AQUA)
let crystalTimer = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.LIGHT_PURPLE)

let crystalTicks = 0
let relicTicks = 0

const tickCounter = register("packetReceived", () => {
    crystalTicks--
    relicTicks--
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

// Relic Timers
const relicTrigger = register("chat", () => {
    relicTicks = parseInt(config().relicSpawnTimerAmt)
    tickCounter.register()
}).setCriteria("[BOSS] Necron: All this, for nothing...")

registerWhen(register("renderOverlay", () => {
    let timeLeft = (relicTicks / 20).toFixed(2)

    relicTimer.setString(timeLeft)
    relicTimer.setScale(data.relicSpawnTimer.scale)
    relicTimer.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
}), () => config().relicToggle && relicTicks > 0)

// Crystal Timers
const crystalTriggerOne = register("chat", () => {
    crystalTicks = 34
    tickCounter.register()
}).setCriteria("[BOSS] Maxor: THAT BEAM! IT HURTS! IT HURTS!!")

const crystalTriggerTwo = register("chat", () => {
    crystalTicks = 34
    tickCounter.register()
}).setCriteria("[BOSS] Maxor: YOU TRICKED ME!")

registerWhen(register("renderOverlay", () => {
    let timeLeft = (crystalTicks / 20).toFixed(2)

    crystalTimer.setString(timeLeft)
    crystalTimer.setScale(data.crystalSpawnTimer.scale)
    crystalTimer.draw(data.crystalSpawnTimer.x, data.crystalSpawnTimer.y)
}), () => config().crystalToggle && crystalTicks > 0)

// Config Triggers.
register("renderOverlay", () => {
    if (gui_config.relicSpawnTimerGui.isOpen()) {
        relicTimer.setString("2.00")
        relicTimer.setScale(data.relicSpawnTimer.scale)
        relicTimer.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
    }
    if (gui_config.crystalSpawnTimerGui.isOpen()) {
        crystalTimer.setString("2.00")
        crystalTimer.setScale(data.crystalSpawnTimer.scale)
        crystalTimer.draw(data.crystalSpawnTimer.x, data.crystalSpawnTimer.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (gui_config.relicSpawnTimerGui.isOpen() && (bn != 2)) {
        data.relicSpawnTimer.x = x
        data.relicSpawnTimer.y = y
        data.save()
    }
    if (gui_config.crystalSpawnTimerGui.isOpen() && (bn != 2)) {
        data.crystalSpawnTimer.x = x
        data.crystalSpawnTimer.y = y
        data.save()
    }
})

register("scrolled", (x, y, dir) => {
    if (gui_config.relicSpawnTimerGui.isOpen()) {
        if (dir == 1) data.relicSpawnTimer.scale += 0.05
        else data.relicSpawnTimer.scale -= 0.05
        data.save()
    }
    if (gui_config.crystalSpawnTimerGui.isOpen()) {
        if (dir == 1) data.crystalSpawnTimer.scale += 0.05
        else data.crystalSpawnTimer.scale -= 0.05
        data.save()
    }
})

register("guiMouseClick", (x, y, bn) => {
    if (gui_config.relicSpawnTimerGui.isOpen() && (bn == 2)) {
        data.relicSpawnTimer.x = Renderer.screen.getWidth() / 2
        data.relicSpawnTimer.y = Renderer.screen.getHeight() / 2 + 10
        data.relicSpawnTimer.scale = 1
        data.save()
    }
    if (gui_config.crystalSpawnTimerGui.isOpen() && (bn == 2)) {
        data.crystalSpawnTimer.x = Renderer.screen.getWidth() / 2
        data.crystalSpawnTimer.y = Renderer.screen.getHeight() / 2 + 10
        data.crystalSpawnTimer.scale = 1
        data.save()
    }
})

export function toggle() {
    if (config().timersToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Spawn Timers &amodule.")
        if (config().crystalToggle) {
            crystalTriggerOne.register()
            crystalTriggerTwo.register()
        }
        if (config().relicToggle) relicTrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Spawn Timers &cmodule.")
    crystalTriggerOne.unregister()
    crystalTriggerTwo.unregister()
    relicTrigger.unregister()
    return
}
export default { toggle };