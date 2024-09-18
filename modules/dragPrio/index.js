import config from "../../config";
import { chat, dragInfo, getClass, getTruePower, findClosestColor, holdingXItem, calculateAngle, getDistance, setPitch, setYaw, swapItem } from "../../utils/utils";
import { handleSnaps, renderWaypoints } from "./auto";

let scanParticles = false;
let currDragons = [null, null]
let displayText = null
export let prioDrag = null;

let doSplit = true;

let ticks 

let dragDelays = {
    purple: 350,
    red: 440,
    orange: 440,
    green: 420,
    blue: 420,
    icespray: 100
}
let lastCharge = null
let charged = false
let waitAmount = 0

export const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
const dragLocations = {
    purple: [56, 126],
    red: [28, 56],
    orange: [83, 58],
    green: [28, 91],
    blue: [83, 97],    
    middle: [54.5, 76.5]
}

export function pathfindDragon(drag) {
    if (Client.isInGui() || Client.isInChat()) return

    let jumping = false
    KeyBinding.func_74510_a(17, true)
    const pathfind = register('step', () => {
        if (Client.isInGui() || Client.isInChat()) {
            KeyBinding.func_74510_a(42, false)
            KeyBinding.func_74510_a(17, false)
            KeyBinding.func_74510_a(57, false)
            pathfind.unregister()
            return
        }
        x = dragLocations[drag][0]
        z = dragLocations[drag][1]

        if (getDistance(parseInt(Player.getX()), parseInt(Player.getZ()), x, z) < 1.5) {
            if (!(drag == 'middle')) setPitch(-90) 
            KeyBinding.func_74510_a(17, false);
            KeyBinding.func_74510_a(42, false)
            swapItem('Last Breath') 
            moving = false;
            pathfind.unregister()
            return
        }

        if (getDistance(parseInt(Player.getX()), parseInt(Player.getZ()), x, z) < 4) KeyBinding.func_74510_a(42, true)

        const block = Player.lookingAt();
        if (block instanceof Block) {
            if (!jumping) {
                jumping = true;
                KeyBinding.func_74510_a(57, jumping);
            }
        } else {
            if (jumping) {
                jumping = false;
                KeyBinding.func_74510_a(57, jumping);
            } 
        }
        
        setYaw(calculateAngle(Player.getX(), Player.getZ(), x, z))
        setPitch(18)
    }).setFps(200)
}

const handleDebuff = register("tick", () => {
    if (!(holdingXItem('Last Breath')) || !(Player.getPitch() < -70)) {
        if (charged) {
            charged = false
            KeyBinding.func_74510_a(-99, charged)
        }
        return
    }
    if (
        new Date().getTime() - lastCharge < waitAmount || 
        !holdingXItem('Last Breath') || 
        !(Player.getPitch() < -70) || 
        !config().toggleAutoLB || 
        (Player.getY() > 31)
    ) return
    charged = !charged
    if (charged) {
        waitAmount = dragDelays[findClosestColor()]
    }
    else {waitAmount = 350}
    KeyBinding.func_74510_a(-99, charged)
    lastCharge = new Date().getTime()
}).unregister();


export function doSpray() {
    if (getClass() == "Archer" || getClass() == "Berserk") return;
    KeyBinding.func_74510_a(57, true)
    KeyBinding.func_74510_a(-99, false)
    setTimeout(() => { swapItem("Ice Spray Wand") }, randomize(25, 5));
    setTimeout(() => {
        KeyBinding.func_74510_a(-99, true)
        KeyBinding.func_74510_a(57, false)
        setTimeout(() => {
            KeyBinding.func_74510_a(-99, false)
            if (getClass() == 'Mage') swapItem(`Midas' Sword`)
            else swapItem('Soul Whip')
        }, randomize(100, 25));
    }, randomize(100, 25));
}

const tickCounter = register("packetReceived", () => {
    ticks--
    if (ticks == config().sprayTick && config().toggleAutoP5 && config().cheatToggle && !(getClass() == "Archer" || getClass() == "Berserk") && config().toggleSpray) {
        doSpray();
    }
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
        if (config().toggleAutoP5 && config().cheatToggle && !(getClass() == "Archer" || getClass() == "Berserk")) {
            if (!config().togglePathFind) return
            chat(`Pathfinding to ${drag.dragString}&7!`);
            pathfindDragon(drag.name);
            if (doSplit) {
                doSplit = false;
                setTimeout(() => {
                    pathfindDragon('middle')
                }, 10000);
            }
        }
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
            if (config().toggleAutoP5 && config().cheatToggle && !(getClass() == "Archer" || getClass() == "Berserk")) {
                if (!config().togglePathFind) return
                chat(`Pathfinding to ${bersDrag.dragString}&7!`);
                pathfindDragon(bersDrag.name);
                if (doSplit) {
                    doSplit = false;
                    setTimeout(() => {
                        pathfindDragon('middle')
                    }, 10000);
                }
            }
        } else {
            displayText = `${archDrag.dragString}!`
            if (config().toggleAutoP5 && config().cheatToggle && !(getClass() == "Archer" || getClass() == "Berserk")) {
                if (!config().togglePathFind) return
                chat(`Pathfinding to ${archDrag.dragString}&7!`);
                pathfindDragon(archDrag.name);
                if (doSplit) {
                    doSplit = false;
                    setTimeout(() => {
                        pathfindDragon('middle')
                    }, 10000);
                }
            }
        }
    } else {
        displayText = `${normalDrag.dragString}!`
        if (config().toggleAutoP5 && config().cheatToggle && !(getClass() == "Archer" || getClass() == "Berserk")) {
            if (!config().togglePathFind) return
            chat(`Pathfinding to ${normalDrag.dragString}&7!`);
            pathfindDragon(normalDrag.name);
            if (doSplit) {
                doSplit = false;
                setTimeout(() => {
                    pathfindDragon('middle')
                }, 10000);
            }
        }
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

    handleDebuff.register();
    doSplit = true;

    if (config().toggleWaypoints) renderWaypoints.register();
    if (config().snapWaypoints) handleSnaps.register();
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
        displayText = null
    }
}).unregister();

register('worldLoad', () => {
    scanParticles = false
    renderWaypoints.unregister();
    handleSnaps.unregister();
})

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