import config from "../../config";
import { chat, dragInfo, getClass, getTruePower } from "../../utils/utils";

// Variables
let scanParticles = false;
let currDragons = [null, null]
let displayText = new Text("")
let showText = false

let mageTeam = false
let soulSpawn = false
let healer = false
let tank = false

// Functions
function isEasySplit() { return (currDragons[0].easy && currDragons[1].easy) }
function checkBlockPos(x, y, z) {
    if (!(y >= 14 && y <= 19)) return
    if (x >= 27 && x <= 32) {
        if (z == 59) {
            if (!(dragInfo.POWER.spawned)) {
                dragInfo.POWER.spawned = true
                assignDrag(dragInfo.POWER)
                setTimeout(() => {
                    dragInfo.POWER.spawned = false
                }, 8000)
            }
        } else if (z == 94) {
            if (!(dragInfo.APEX.spawned)) {
                dragInfo.APEX.spawned = true
                assignDrag(dragInfo.APEX)
                setTimeout(() => {
                    dragInfo.APEX.spawned = false
                }, 8000)
            }
        }
    } else if (x >= 79 && x <= 85) {
        if (z == 94) {
            if (!(dragInfo.ICE.spawned)) {
                dragInfo.ICE.spawned = true
                assignDrag(dragInfo.ICE)
                setTimeout(() => {
                    dragInfo.ICE.spawned = false
                }, 8000)
            }
        } else if (z == 56) {
            if (!(dragInfo.FLAME.spawned)) {
                dragInfo.FLAME.spawned = true
                assignDrag(dragInfo.FLAME)
                setTimeout(() => {
                    dragInfo.FLAME.spawned = false
                }, 8000)
            }
        }
    } else if (x == 56) {
        if (!(dragInfo.SOUL.spawned)) {
            dragInfo.SOUL.spawned = true
            purpleSpawn = true
            assignDrag(dragInfo.SOUL)
            setTimeout(() => {
                dragInfo.SOUL.spawned = false
            }, 8000)
        }
    }
}
function assignDrag(drag) {
    if (currDragons[0] == null) {
        currDragons[0] = drag
    } else if (currDragons[1] == null) {
        currDragons[1] = drag
        determinePrio()
    }
    else if (config.showSingleDragons) {
        displayText = new Text(`${drag.dragColor} Dragon!`).setScale(5).setColor(drag.renderColor).setShadow(true)
        showText = true
        setTimeout(() => {
            showText = false
        }, 2000)
    }
}
function determinePrio() {
    let normalDrag = (currDragons[0].prio[0] < currDragons[1].prio[0] ? currDragons[0] : currDragons[1])
    let truePower = getTruePower()
    let split = 0
    if (truePower >= config.splitPower) {
        split = 1
    } else if (isEasySplit() && truePower >= config.easyPower) {
        split = 1
    }
    if (currDragons[0].prio[split] < currDragons[1].prio[split]) {
        bersDrag = currDragons[0]
        archDrag = currDragons[1]
    } else {
        bersDrag = currDragons[1]
        archDrag = currDragons[0]
    }
    displayDragon(bersDrag, archDrag, normalDrag, split)
}
function displayDragon(bersDrag, archDrag, normalDrag, split) {
    if (split) {
        if ((mageTeam) || (soulSpawn && ((healer && config.healerPurp == 1) || (tank && config.tankPurp == 1)))) {
            displayText = new Text(`${bersDrag.dragColor} Dragon!`).setScale(5).setColor(bersDrag.renderColor).setShadow(true)
        } else {
            displayText = new Text(`${archDrag.dragColor} Dragon!`).setScale(5).setColor(archDrag.renderColor).setShadow(true)
        }
    } else {
        displayText = new Text(`${normalDrag.dragColor} Dragon!`).setScale(5).setColor(normalDrag.renderColor).setShadow(true)
    }
    showText = true
    setTimeout(() => {
        showText = false
    }, 2000)
}


// Registers
const handleStart = register('chat', () => {
    currDragons = [null, null]
    soulSpawn = false
    mageTeam = false
    healer = false
    tank = false
    dragInfo.POWER.spawned = false
    dragInfo.FLAME.spawned = false
    dragInfo.ICE.spawned = false
    dragInfo.SOUL.spawned = false
    dragInfo.APEX.spawned = false

    let selectedClass = getClass()

    if (selectedClass[0] == 'B' || selectedClass[0] == 'M') {
        bersTeam = true
    } else if (selectedClass[0] == 'H') {
        healer = true
        if (Settings.healerNormal == 1) { bersTeam = true }
    } else if (selectedClass[0] == 'T') {
        tank = true
        if (Settings.tankNormal == 1) { bersTeam = true }
    } else { bersTeam = false }

    scanParticles = true;
}).setCriteria(/(.+)&r&a picked the &r&cCorrupted Blue Relic&r&a!&r/).unregister();

const handleParticles = register("packetReceived", (packet) => {
    if (scanParticles && packet.func_179749_a().toString() == "ENCHANTMENT_TABLE") {
        checkBlockPos(parseInt(packet.func_149220_d()), parseInt(packet.func_149226_e()), parseInt(packet.func_149225_f()))
    }
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles).unregister();

const handleRender = register('renderOverlay', () => {
    if (showText) { displayText.draw((Renderer.screen.getWidth() - displayText.getWidth()) / 2, (Renderer.screen.getHeight() - displayText.getHeight()) / 2 - 2) }
})

register('worldLoad', () => {
    scanParticles = false
})
  
export function toggle() {
    if (config.dragPrioToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Drag Prio &amodule.")
        handleStart.register()
        handleParticles.register()
        handleRender.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Drag Prio &cmodule.")
    handleStart.unregister()
    handleParticles.unregister()
    handleRender.unregister()
    return
}
export default { toggle };