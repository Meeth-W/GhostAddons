import config from "../../config";
import { chat, dragInfo, getClass, getItemIndex, getTruePower, randomize } from "../../utils/utils";

// Variables
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

let dragAlive

let keybinds = {
    jump: Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(),
    rightclick: Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i()
}
const keyState = {};
Object.keys(keybinds).forEach(keyName => keyState[keyName] = false);

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
export function updateKeys() {
	Object.keys(keyState).forEach(keyName => KeyBinding.func_74510_a(keybinds[keyName], keyState[keyName]));
}

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
        displayText = `${drag.dragString} dragon`

        if (config().autoSpray && !config().autoSpraySplit && config().cheatToggle) { jumpSpray(drag) }
        if (config().autoDBToggle && !config().autoLBsplit && config().cheatToggle) { autoLB(drag) }
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
            if (config().autoSpray && config().cheatToggle) { jumpSpray(bersDrag) }
            if (config().autoDBToggle && config().cheatToggle) { autoLB(bersDrag) }
        } else {
            displayText = `${archDrag.dragString}!`
            if (config().autoSpray && config().cheatToggle) { jumpSpray(archDrag) }
            if (config().autoDBToggle && config().cheatToggle) { autoLB(archDrag) }
        }
    } else {
        displayText = `${normalDrag.dragString}!`
        if (config().autoSpray && config().cheatToggle) { jumpSpray(normalDrag) }
        if (config().autoDBToggle && config().cheatToggle) { autoLB(normalDrag) }
    }
}
function inDebuffPosition() { return (Player.getPitch() < -70) }
function jumpSpray(drag) {
    setTimeout(() => {
        chat(`&cStarting Jump Spray on ${drag? drag.dragString: ''}&r&c!`)
        keyState.jump = true
        updateKeys()
        setTimeout(() => { 
            keyState.jump = false
            updateKeys()
        }, randomize(100, 25))
        setTimeout(() => {
            if (keyState.rightclick) { 
                keyState.rightclick = false
                updateKeys() 
            }
            setTimeout(() => { 
                spraySlot = getItemIndex('Ice Spray Wand')
                Player.setHeldItemIndex(spraySlot) 
            }, randomize(25, 5))
        }, randomize(200, 25))

        setTimeout(() => {
            keyState.rightclick = true
            updateKeys()
            setTimeout(() => {
                keyState.rightclick = false
                updateKeys()
                setTimeout(() => { Player.setHeldItemIndex(config().swapSlot) }, randomize(25, 5))
            }, randomize(100, 25))
        }, randomize(300, 25))
    }, randomize(parseInt(config().jumpSprayDelay), parseInt(config().randomFlux)))
}
function spamDebuff() {
    if (!inDebuffPosition()) return
    if (dragAlive) return
    setTimeout(() => { 
        keyState.rightclick = true
        updateKeys() 
    }, randomize(60, 10))
    setTimeout(() => {
        keyState.rightclick = false
        updateKeys()
        spamDebuff()
    }, randomize(parseInt(config().spamLBdelay), parseInt(config().randomFlux)))
}
function spamLB() {
    if (dragAlive) return
    if (!inDebuffPosition) {
        if (config().debug) chat('Not in position. Trying Again.')
        setTimeout(() => { spamLB() }, 100);
    } else {
        if (config().debug) chat(`Starting Spam Debuff. In postion.`)
        spamDebuff();
    }
}
function autoLB(drag) {
    setTimeout(() => {
        chat(`&aStarting Auto Debuff on ${drag? drag.dragString: ''}&r&a!`)
        Player.setHeldItemIndex(getItemIndex('Last Breath'))
        setTimeout(() => {
            spamLB();
        }, randomize(25, 5));
    }, randomize(2500, parseInt(config().randomFlux)));
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
}).setCriteria(/(.+)&r&a picked the &r&cCorrupted Blue Relic&r&a!&r/).unregister();

const handleParticles = register("packetReceived", (packet) => {
    if (scanParticles && packet.func_179749_a().toString() == "ENCHANTMENT_TABLE") {
        checkBlockPos(parseInt(packet.func_149220_d()), parseInt(packet.func_149226_e()), parseInt(packet.func_149225_f()))
    }
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles).unregister();

const handleRender = register('renderOverlay', () => {
    if (ticks > 0) {
        const displayColor = (ticks > 60)? "&a" : (ticks > 20)? "&e": "&c";
        if (ticks > 60) Client.Companion.showTitle((displayText)? displayText: " ", `&7Spawn in ${displayColor}${(ticks/20).toFixed(2)}`, 0, 2, 0)
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
})

register("command", () => {
    jumpSpray(dragInfo.APEX)
    autoLB(dragInfo.APEX)
    setTimeout(() => {
        dragAlive = true
        setTimeout(() => { dragAlive = false }, 1000)
    }, 5000);
}).setName("debuff")

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