import config from "../../config"
import { prefix, getClass, getDistance } from "../../utils/utils"

let dialogueSaid = false
let moveTime
let bloodStarted
let bloodCleared
let watcherX
let watcherZ
let playerClass
let inPosition = false
let diamanteWarning = new Text("&bDiamante Giant Detected!").setScale(2).setShadow(true)
let alerted = false
let showText = false
let showAlert = false

const Zombie = Java.type("net.minecraft.entity.monster.EntityZombie")
const Giant = Java.type("net.minecraft.entity.monster.EntityGiantZombie")
const skullOwner = ["3f6d5cfc-cbd8-3ac7-8418-8d51f12c67a3", "83b07a68-a99e-3eeb-89d8-68965a4b9801"]

function isWatcher(e) {
    let nbt = new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()
    if (nbt) {
        for (let texture of skullOwner) {
            if (nbt.includes(texture)) {
                return true
            }
        }
    }
    return false
}

// BLOOD OPENED

const open = register("chat", () => {
    bloodStarted = Date.now()
    playerClass = getClass()

    let entities = World.getAllEntitiesOfType(Zombie)
    entities.forEach(e => {
        if (isWatcher(e)) {
            setTimeout(() => {
                watcherX = e.getX()
                watcherZ = e.getZ()
            }, 1000)
        }
    })
}).setCriteria("[BOSS] The Watcher: Things feel a little more roomy now, eh?").unregister()

// DIALOGUE APPEARS

const spawn = register("chat", () => {
    if (config().alertDiamante && playerClass == "Mage")
    World.playSound("random.orb", 2, 0)
    showText = true
    setTimeout(() => {
        showText = false
    }, 2000)
    setTimeout(() => {
        dialogueSaid = true
    }, 500)
}).setCriteria("[BOSS] The Watcher: Let's see how you can handle this.").unregister()


// LOOKING FOR MOVE

register("tick", () => {
    let entities = World.getAllEntitiesOfType(Zombie)
    if (dialogueSaid && playerClass == "Mage" && config().alertDiamante)
    entities.forEach(e => {
        if (isWatcher(e)) {
            // moved
            // assigns value to moveTime first if arrived late so it no longer looks for inPosition
            if (getDistance(e.getX(), e.getZ(), watcherX, watcherZ) > 1) {
                dialogueSaid = false
                moveTime = Date.now()
            }
            // checking if in position
            // inPosition means it was successfully rendered before it moved
            if (!inPosition && !moveTime) {
                if (getDistance(e.getX(), e.getZ(), watcherX, watcherZ) < 1) {
                    inPosition = true
                }
            }
        }
    })
}).unregister()

// CAMP FINISHED

const finish = register("chat", () => {
    if (config().alertDiamante && playerClass == "Mage")
    bloodCleared = Date.now()
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.").unregister()


register("worldLoad", () => {
    dialogueSaid = false
    inPosition = false
    alerted = false
    inBoss = false
    moveTime = null
    bloodStarted = null
    bloodCleared = null
})

// LOOKING FOR DIAMANTE

const diamante = register("tick", () => {
    let entities = World.getAllEntitiesOfType(Giant)
    if (!alerted && playerClass == "Mage")
    entities.forEach(e => {
        if (new EntityLivingBase(e?.getEntity()).getItemInSlot(3)?.getNBT()?.toString()?.includes("diamond_chestplate")) {
            alerted = true
            showAlert = true
            World.playSound("random.orb", 2, 0)
            setTimeout(() => {
                showAlert = false
            }, 2000)
        }
    })
}).unregister()

const render2 = register("renderOverlay", () => {
    if (showAlert) {
        diamanteWarning.draw((Renderer.screen.getWidth() - diamanteWarning.getWidth()) / 2, (Renderer.screen.getHeight() - diamanteWarning.getHeight()) / 2 - 100);
    }
}).unregister()

export function toggle() {
    if (config().alertDiamante && config().toggle) {
        if (config().debug) chat("&aStarting the &6Diamante Alert &amodule.")
        open.register()
        spawn.register()
        finish.register()
        render2.register()
        diamante.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Diamante Alert &cmodule.")
        open.unregister()
        spawn.unregister()
        finish.unregister()
        render2.unregister()
        diamante.unregister()
    return
}
export default { toggle };