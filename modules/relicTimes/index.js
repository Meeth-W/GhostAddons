import config from "../../config"
import { chat, prefix, getDistance } from "../../utils/utils"
import { data } from "../../utils/data"
import { registerWhen } from "../../../BloomCore/utils/Utils"

let p5Started
let pickedRelic
let relic
let spawned
let scanning = false
let r, g, p, o, b

/*
let relicCoords = {
    'red': [21, 7, 60],
    'orange': [93, 7, 57],
    'blue': [92,7, 95],
    'purple': [57, 9, 133],
    'green': [21, 7, 95]
}
*/

const trigger = register("chat", () => {
    if (config().relicTimer)
    p5Started = Date.now()
    scanning = true
}).setCriteria("[BOSS] Necron: All this, for nothing...").unregister();

const mainTrigger = register("chat", (name, relicPicked) => {
    if (config().relicTimer)
    if (name != Player.getName()) return
    pickedRelic = Date.now()
    relic = relicPicked
    rcListener.register()
    lcListener.register()
}).setCriteria(/(\w+) picked the Corrupted (\w+) Relic!/).unregister();

const rcListener = register('playerInteract', (action, pos) => {
    if (action.toString() != "RIGHT_CLICK_BLOCK") return
    const blockClicked = World.getBlockAt(pos.getX(), pos.getY(), pos.getZ()).type.getRegistryName()
    if ((blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil') || (!Player.getHeldItem()?.getName()?.includes('Relic') && !Player.getHeldItem()?.getName()?.includes('SkyBlock Menu'))) return
    relicMessage()
}).unregister()

const lcListener = register('hitBlock', (block) => {
    const blockClicked = block.type.getRegistryName()
    if ((blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil') || (!Player.getHeldItem()?.getName()?.includes('Relic') && !Player.getHeldItem()?.getName()?.includes('SkyBlock Menu'))) return
    relicMessage()
}).unregister()

function relicMessage() {
    let placeTime = (Date.now() - pickedRelic) / 1000
    let sinceP5 = (Date.now() - p5Started) / 1000
    let relicColor
    switch(relic) {
        case "Red": 
            relicColor = "&c"
            break
        case "Orange": 
            relicColor = "&6"
            break
        case "Green": 
            relicColor = "&a"
            break
        case "Blue": 
            relicColor = "&b"
            break
        case "Purple": 
            relicColor = "&5"
            break
    }

    let msg = `${prefix}${relicColor}${relic} Relic &aplaced in &e${placeTime}s&a.`
    if (!data.relicTimer[relic] || placeTime < data.relicTimer[relic]) {
        data.relicTimer[relic] = placeTime
        data.save()
        msg += " &d&l(PB)"
    } else {
        msg += ` &8(&7${data.relicTimer[relic]}&8)`
    }

    new Message(new TextComponent(msg).setHover("show_text", `&dPersonal Best: &a${data.relicTimer[relic]}s`)).chat()
    ChatLib.chat(`${prefix}&aRelic placed &e${sinceP5}s &ainto P5.`)
    let spawnTime = ((spawned - p5Started) / 1000).toFixed(3)
    ChatLib.chat(`${prefix}&aRelic took &e${spawnTime}s &ato spawn.`)
    if (config().relicPickupTime) {
        let pickupTime = ((pickedRelic - spawned) / 1000).toFixed(3)
        ChatLib.chat(`${prefix} &aRelic took &e${pickupTime}s &ato pick up.`)
    }
    rcListener.unregister()
    lcListener.unregister()
}

const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")

registerWhen(register("tick", () => {
    let entities = World.getAllEntitiesOfType(ArmorStand)
    entities.forEach(e => {
        if (new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic")) {
            spawned = Date.now()
            scanning = false
        }
    })
}), () => scanning)

registerWhen(register("tick", () => {
    let entities = World.getAllEntitiesOfType(ArmorStand)
    entities.forEach(e => {
        if (new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic")) {
            let x = e.getX()
            let z = e.getZ()
            if (!r && getDistance(x, z, 52, 43) < 1) {
                // red
                r = ((Date.now() - p5Started) / 1000).toFixed(3)
            }
            if (!g && getDistance(x, z, 50, 45) < 1) {
                // green
                g = ((Date.now() - p5Started) / 1000).toFixed(3)
            }
            if (!p && getDistance(x, z, 55, 42) < 1) {
                // purple
                p = ((Date.now() - p5Started) / 1000).toFixed(3)
            }
            if (!o && getDistance(x, z, 58, 43) < 1) {
                // orange
                o = ((Date.now() - p5Started) / 1000).toFixed(3)
            }
            if (!b && getDistance(x, z, 60, 45) < 1) {
                // blue
                b = ((Date.now() - p5Started) / 1000).toFixed(3)
            }
        }
    })
    if (r && g && p && o && b) {
        ChatLib.chat(`${prefix} &cRed Relic &aplaced in &e${r}s&a.`)
        ChatLib.chat(`${prefix} &aGreen Relic &aplaced in &e${g}s&a.`)
        ChatLib.chat(`${prefix} &5Purple Relic &aplaced in &e${p}s&a.`)
        ChatLib.chat(`${prefix} &6Orange Relic &aplaced in &e${o}s&a.`)
        ChatLib.chat(`${prefix} &bBlue Relic &aplaced in &e${b}s&a.`)
        p5Started = false
    }
}), () => config().showEveryRelic && p5Started)

const worldTrigger = register("worldLoad", () => {
    p5Started = null
    r = g = p = o = b = null
}).unregister();

//////////

const cmdTrigger = register("command", () => {
    let entities = World.getAllEntitiesOfType(ArmorStand)
    entities.forEach(e => {
        let elb = new EntityLivingBase(e?.getEntity())
        if (elb.getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic")) {
            ChatLib.chat(elb.getItemInSlot(4)?.getNBT()?.toString())
        }
    })
    //
}).setName("scan")

export function toggle() {
    if (config().bossToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Relic Times &amodule.")
        trigger.register()
        cmdTrigger.register()
        worldTrigger.register()
        mainTrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Relic Times &cmodule.")
        trigger.unregister()
        cmdTrigger.unregister()
        worldTrigger.unregister()
        mainTrigger.unregister()
        return
}
export default { toggle };