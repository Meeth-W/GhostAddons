import { registerWhen } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { data } from "../../utils/data";
import { chat, getClass } from "../../utils/utils";

let relicTimer = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.AQUA)
let dragTimer = new Text('').setScale(1).setShadow(true).setAlign('CENTER')
let crystalTimer = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.LIGHT_PURPLE)

let crystalTicks = 0
let dragTicks = 0
let relicTicks = 0

let redSpawning = false
let orangeSpawning = false
let blueSpawning = false
let purpleSpawning = false
let greenSpawning = false
let drags = [null, null]

let inP5 = false

const dragInfo = {
    purple: { color: Renderer.LIGHT_PURPLE, prio: [0, 4] },
    blue: { color: Renderer.BLUE, prio: [1, 0] },
    red: { color: Renderer.RED, prio: [2, 1] },
    green: { color: Renderer.GREEN, prio: [3, 2] },
    orange: { color: Renderer.GOLD, prio: [4, 3] }
}

const tickCounter = register("packetReceived", () => {
    crystalTicks--
    dragTicks--
    relicTicks--
    // if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

// Location Checks
register("chat", () => {
    inP5 = true
}).setCriteria("[BOSS] Necron: All this, for nothing...")

// Drag Prio.
const dragPrioTrigger = register("packetReceived", (packet) => {
    if (inP5 && packet.func_179749_a().toString() == "ENCHANTMENT_TABLE") {
        handleParticles(parseInt(packet.func_149220_d()), parseInt(packet.func_149226_e()), parseInt(packet.func_149225_f()))
    }
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles).unregister();

registerWhen(register("renderOverlay", () => {
    let timeLeft = (dragTicks / 20).toFixed(2)

    dragTimer.setString(timeLeft)
    dragTimer.setScale(data.dragonSpawnTimer.scale)
    dragTimer.draw(data.dragonSpawnTimer.x, data.dragonSpawnTimer.y)
}), () => config.dragToggle && dragTicks > 0)

register("worldLoad", () => {
    inP5 = false
    dragTicks = 0
    redSpawning = false
    orangeSpawning = false
    blueSpawning = false
    purpleSpawning = false
    greenSpawning = false
    tickCounter.unregister()
    drags = [null, null]
})

function assignColor(drag) {
    if (!drags[0]) {
        drags[0] = drag
    } else if (!drags[1] && drag != drags[0]) {
        drags[1] = drag
        determinePrio()
    } else {
        // change the color of dragTimer
        dragTimer.setColor(drag.color)
    }
}

// changes color of dragTimer
function determinePrio() {
    if (getClass() == "Archer" && getClass() == "Tank") {
        if (drags[0].prio[0] < drags[1].prio[0]) {
            dragTimer.setColor(drags[0].color)
        } else {
            dragTimer.setColor(drags[1].color)
        }
    } else if (getClass() == "Berserk" && getClass() == "Mage") {
        if (drags[0].prio[0] > drags[1].prio[0]) {
            dragTimer.setColor(drags[0].color)
        } else {
            dragTimer.setColor(drags[1].color)
        }
    } else if (getClass() == "Healer") {
        if (drags[0].prio[1] < drags[1].prio[1]) {
            dragTimer.setColor(drags[0].color)
        } else {
            dragTimer.setColor(drags[1].color)
        }
    }
}

function handleParticles(x, y, z) {
    // check if correct height
    if (y >= 14 && y <= 19) {
        // check if red/green
        if (x >= 27 && x <= 32) {
            // check if red
            if (z == 59) {
                if (!redSpawning) {
                    assignColor(dragInfo.red)
                    dragTicks = 100
                    tickCounter.register()
                    redSpawning = true
                    setTimeout(() => {
                        redSpawning = false
                    }, 8000)
                }
            // check if green
            } else if (z == 94) {
                if (!greenSpawning) {
                    assignColor(dragInfo.green)
                    dragTicks = 100
                    tickCounter.register()
                    greenSpawning = true
                    setTimeout(() => {
                        greenSpawning = false
                    }, 8000)
                }
            }
        // check if blue/orange
        } else if (x >= 79 && x <= 85) {
            // check if blue
            if (z == 94) {
                if (!blueSpawning) {
                    assignColor(dragInfo.blue)
                    dragTicks = 100
                    tickCounter.register()
                    blueSpawning = true
                    setTimeout(() => {
                        blueSpawning = false
                    }, 8000)
                }
            // check if orange
            } else if (z == 56) {
                if (!orangeSpawning) {
                    assignColor(dragInfo.orange)
                    dragTicks = 100
                    tickCounter.register()
                    orangeSpawning = true
                    setTimeout(() => {
                        orangeSpawning = false
                    }, 8000)
                }
            }
        // check if purple    
        } else if (x == 56) {
            if (!purpleSpawning) {
                assignColor(dragInfo.purple)
                dragTicks = 100
                tickCounter.register()
                purpleSpawning = true
                setTimeout(() => {
                    purpleSpawning = false
                }, 8000)
            }
        }
    }
}


// Relic Timers

const relicTrigger = register("chat", () => {
    relicTicks = parseInt(config.relicSpawnTimerAmt)
    tickCounter.register()
}).setCriteria("[BOSS] Necron: All this, for nothing...")

registerWhen(register("renderOverlay", () => {
    let timeLeft = (relicTicks / 20).toFixed(2)

    relicTimer.setString(timeLeft)
    relicTimer.setScale(data.relicSpawnTimer.scale)
    relicTimer.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
}), () => config.relicToggle && relicTicks > 0)

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
}), () => config.crystalToggle && crystalTicks > 0)

// Config Triggers.
register("renderOverlay", () => {
    if (config.relicSpawnTimerGui.isOpen()) {
        relicTimer.setString("2.00")
        relicTimer.setScale(data.relicSpawnTimer.scale)
        relicTimer.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
    }
    if (config.crystalSpawnTimerGui.isOpen()) {
        crystalTimer.setString("2.00")
        crystalTimer.setScale(data.crystalSpawnTimer.scale)
        crystalTimer.draw(data.crystalSpawnTimer.x, data.crystalSpawnTimer.y)
    }
    if (config.dragonSpawnTimerGui.isOpen()) {
        dragTimer.setString("5.00")
        dragTimer.setScale(data.dragonSpawnTimer.scale)
        dragTimer.draw(data.dragonSpawnTimer.x, data.dragonSpawnTimer.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (config.relicSpawnTimerGui.isOpen() && (bn != 2)) {
        data.relicSpawnTimer.x = x
        data.relicSpawnTimer.y = y
        data.save()
    }
    if (config.crystalSpawnTimerGui.isOpen() && (bn != 2)) {
        data.crystalSpawnTimer.x = x
        data.crystalSpawnTimer.y = y
        data.save()
    }
    if (config.dragonSpawnTimerGui.isOpen() && (bn != 2)) {
        data.dragonSpawnTimer.x = x
        data.dragonSpawnTimer.y = y
        data.save()
    }
})

register("scrolled", (x, y, dir) => {
    if (config.relicSpawnTimerGui.isOpen()) {
        if (dir == 1) data.relicSpawnTimer.scale += 0.05
        else data.relicSpawnTimer.scale -= 0.05
        data.save()
    }
    if (config.crystalSpawnTimerGui.isOpen()) {
        if (dir == 1) data.crystalSpawnTimer.scale += 0.05
        else data.crystalSpawnTimer.scale -= 0.05
        data.save()
    }
    if (config.dragonSpawnTimerGui.isOpen()) {
        if (dir == 1) data.dragonSpawnTimer.scale += 0.05
        else data.dragonSpawnTimer.scale -= 0.05
        data.save()
    }
})

register("guiMouseClick", (x, y, bn) => {
    if (config.relicSpawnTimerGui.isOpen() && (bn == 2)) {
        data.relicSpawnTimer.x = Renderer.screen.getWidth() / 2
        data.relicSpawnTimer.y = Renderer.screen.getHeight() / 2 + 10
        data.relicSpawnTimer.scale = 1
        data.save()
    }
    if (config.crystalSpawnTimerGui.isOpen() && (bn == 2)) {
        data.crystalSpawnTimer.x = Renderer.screen.getWidth() / 2
        data.crystalSpawnTimer.y = Renderer.screen.getHeight() / 2 + 10
        data.crystalSpawnTimer.scale = 1
        data.save()
    }
    if (config.dragonSpawnTimerGui.isOpen() && (bn == 2)) {
        data.dragonSpawnTimer.x = Renderer.screen.getWidth() / 2
        data.dragonSpawnTimer.y = Renderer.screen.getHeight() / 2 + 40
        data.dragonSpawnTimer.scale = 3
        data.save()
    }
})

export function toggle() {
    if (config.timersToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Spawn Timers &amodule.")
        if (config.dragToggle) dragPrioTrigger.register()
        if (config.crystalToggle) {
            crystalTriggerOne.register()
            crystalTriggerTwo.register()
        }
        if (config.relicToggle) relicTrigger.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Spawn Timers &cmodule.")
    dragPrioTrigger.unregister()
    crystalTriggerOne.unregister()
    crystalTriggerTwo.unregister()
    relicTrigger.unregister()
    return
}
export default { toggle };