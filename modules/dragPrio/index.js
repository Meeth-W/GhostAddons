import config from "../../config";
import { chat, dragInfo, getClass, getTruePower } from "../../utils/utils";
import { renderWaypoints } from "./render";
import { doSpray, pathFind } from "./utils";

// Variables
export const dragLocations = {
    purple: {x: 56, y: 7, z: 126},
    red: {x: 28, y: 6, z: 56},
    orange: {x: 83, y: 6, z: 58},
    green: {x: 28, y: 6, z: 91},
    blue: {x: 83, y: 6, z: 97},
    wait: {x: 54.5, y: 5, z: 76.5}
}

export const stackLocations = {
    purple: {x: 25, y: 6, z: 103},
    red: {x: 12, y: 7, z: 85},
    orange: {x: 55, y: 5, z: 87},
    green: {x: 55, y: 6, z: 108},
    blue: {x: 47, y: 6, z: 110},
    wait: {x: 38, y: 6, z: 104}
}

export const stackRotations = {
    purple: {yaw: -50, pitch: -24.5},
    red: {yaw: -148.5, pitch: -25},
    orange: {yaw: -133, pitch: -27},
    green: {yaw: 116.5, pitch: -29},
    blue: {yaw: -110, pitch: -26},
    wait: {yaw: -90, pitch: 90}
}

let scanParticles = false;
let currDragons = [null, null]
let displayText = null

let ticks 

const tickCounter = register("packetReceived", () => {
    ticks--
    if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()


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
                ticks = 100
                tickCounter.register()
                setTimeout(() => {
                    dragInfo.POWER.spawned = false
                }, 8000)
            }
        } else if (z == 94) {
            if (!(dragInfo.APEX.spawned)) {
                dragInfo.APEX.spawned = true
                assignDrag(dragInfo.APEX)
                ticks = 100
                tickCounter.register()
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
                ticks = 100
                tickCounter.register()
                setTimeout(() => {
                    dragInfo.ICE.spawned = false
                }, 8000)
            }
        } else if (z == 56) {
            if (!(dragInfo.FLAME.spawned)) {
                dragInfo.FLAME.spawned = true
                assignDrag(dragInfo.FLAME)
                ticks = 100
                tickCounter.register()
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
            ticks = 100
            tickCounter.register()
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
    else if (config().showSingleDragons) {
        displayText = `${drag.dragString} Dragon`
    }
}
function determinePrio() {
    let normalDrag = (currDragons[0].prio[0] < currDragons[1].prio[0] ? currDragons[0] : currDragons[1])
    let truePower = getTruePower()
    let split = 0
    if (truePower >= config().splitPower) {
        split = 1
    } else if (isEasySplit() && truePower >= config().easyPower) {
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
        if ((mageTeam) || (soulSpawn && ((healer && config().healerPurp == 1) || (tank && config().tankPurp == 1)))) {
            displayText = `${bersDrag.dragString}!`
        } else {
            displayText = `${archDrag.dragString}!`
        }
    } else {
        displayText = `${normalDrag.dragString}!`
    }
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
        mageTeam = true
    } else if (selectedClass[0] == 'H') {
        healer = true
        if (config().healerNormal == 1) { mageTeam = true }
    } else if (selectedClass[0] == 'T') {
        tank = true
        if (config().tankNormal == 1) { mageTeam = true }
    } else { mageTeam = false }

    scanParticles = true;
    renderWaypoints.register();
}).setCriteria(/(.+)&r&a picked the &r&cCorrupted Blue Relic&r&a!&r/).unregister();

const handleParticles = register("packetReceived", (packet) => {
    if (scanParticles && packet.func_179749_a().toString() == "ENCHANTMENT_TABLE") {
        checkBlockPos(parseInt(packet.func_149220_d()), parseInt(packet.func_149226_e()), parseInt(packet.func_149225_f()))
    }
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles).unregister();

const handleRender = register('renderOverlay', () => {
    if (ticks > 0) {
        const displayColor = (ticks > 60)? "&a" : (ticks > 20)? "&e": "&c";
        if (ticks > 50) Client.Companion.showTitle((displayText)? displayText: " ", `&7Spawn in ${displayColor}${(ticks/20).toFixed(2)}`, 0, 2, 0)
        else Client.Companion.showTitle(" ", `&7Spawn in ${displayColor}${(ticks/20).toFixed(2)}`, 0, 2, 0)
    }
})

const dragSpawnChecker = register(Java.type("net.minecraftforge.event.entity.EntityJoinWorldEvent"), (event) => {
    const entity = new Entity(event.entity)
    if (entity.getClassName() === "EntityDragon") {
        dragAlive = true
        displayText = null
        setTimeout(() => { dragAlive = false }, 150)
    }
}).unregister();

register('worldLoad', () => {
    scanParticles = false
    renderWaypoints.unregister();
})

register("command", (drag) => {
    chat('Spraying!')
    setTimeout(() => {
        doSpray()
    }, 200);
}).setName("testSpray")

register("command", (x, y, z) => {
    setTimeout(() => {
        chat('Running!')
        pathFind(x, y, z, () => {chat('Done!')})
    }, 1000);
}).setName("testDrag")

export function toggle() {
    if (config().dragPrioToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Drag Prio &amodule.")
        handleStart.register()
        handleParticles.register()
        handleRender.register()
        dragSpawnChecker.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Drag Prio &cmodule.")
    handleStart.unregister()
    handleParticles.unregister()
    handleRender.unregister()
    dragSpawnChecker.unregister()
    return
}
export default { toggle };