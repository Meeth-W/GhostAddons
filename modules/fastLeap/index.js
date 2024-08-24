import config from "../../config";
import { data } from "../../utils/data";
import { chat, getClasses, isHoldingLeapItem, isInDungeon, rightClick } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let leaplocation = null
let item
let text = new Text('').setScale(1).setShadow(true).setAlign('LEFT').setColor(Renderer.WHITE);

const classes = ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank']

const getString = () => {
    if (leaptarget) return `&7Leap Target: &6${(leaptarget)} &7| &d${(leaplocation)}`
    return `&7Leap Target: &cNone`
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const openMenuTrigger = register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        const items = Player.getContainer()?.getItems() 
        for (let i = 0; i < items.length; i++) {
            item = (items[i]?.getName())?.substring(2)?.toLowerCase()
            if (leaptarget && item == leaptarget.toLowerCase()) {
                Player.getContainer().click(i)
                if (config().leappchatToggle) ChatLib.command(`pc Leaping to ${leaplocation}`)
                else chat(`&aLeaping to &6${leaplocation}`)
                leaptarget = null
                leaplocation = null
            }
        }
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister();

// Setting Target
const p3Locations = register("chat", (n, a, p) => {
    if (n.toLowerCase() == Player.getName().toLowerCase()) return
    leaptarget = n
    leaplocation = p
}).setCriteria(/Party > .+ (\w+): (At|Inside) (.+)(!)?/).unregister();

const maxorEnd = register("chat", () => {
    leaptarget = (getClasses()[classes[config().maxorEnd]])
    leaplocation = `Storm Phase. [${classes[config().maxorEnd]}]`
}).setCriteria(`[BOSS] Maxor: YOU TRICKED ME!`).unregister();

const stormEnd = register("chat", () => {
    leaptarget = (getClasses()[classes[config().stormEnd]])
    leaplocation = `Goldor Phase. [${classes[config().stormEnd]}]`
}).setCriteria(`[BOSS] Storm: I should have known that I stood no chance.`).unregister();

const goldorEnd = register("chat", () => {
    leaptarget = (getClasses()[classes[config().goldorEnd]])
    leaplocation = `Necron Phase. [${classes[config().goldorEnd]}]`
}).setCriteria(`[BOSS] Necron: I'm afraid, your journey ends now.`).unregister();

const necronEnd = register("chat", () => {
    leaptarget = (getClasses()[classes[config().necronEnd]])
    leaplocation = `Dragons Phase. [${classes[config().necronEnd]}]`
}).setCriteria(`[BOSS] Necron: ARGH!`).unregister();

const relicPickup = register("chat", (username, relic) => {
    if ((relic == 'Red' || relic == 'Orange') || username != Player.getName()) return
    leaptarget = (getClasses()[classes[config().relicPickup]])
    leaplocation = `${classes[config().relicPickup]} Class.`
}).setCriteria('${username} picked the Corrupted ${relic} Relic!').unregister();

const doorTrigger = register("chat", (user) => {
    if (user == Player.getName()) return
    leaptarget = user
    leaplocation = "Wither Door"
}).setCriteria("${user} opened a WITHER door!").unregister()

// Render Handling
const renderTrigger = register('renderOverlay', () => {
    if (!config().leapGuiToggle || !config().cheatToggle || !config().fastLeapToggle) return
    text.setString(getString())
    text.setScale(data.fastLeapGui.scale)
    text.setShadow(true)
    text.draw(data.fastLeapGui.x, data.fastLeapGui.y)
}).unregister();

// Handle Leap Click
const handleClick = register(Java.type("net.minecraftforge.client.event.MouseEvent"), (event) => {
    if (event.button != 0 || !isHoldingLeapItem() || waitingLeap || !event.buttonstate || !Client.isTabbedIn()) return
    if (!isInDungeon()) return chat(`&cFast Leap only works inside dungeons.`)
    if (!leaptarget) return chat(`&cNo Leap Targets.`)
    cancel(event)
    waitingLeap = true
    chat('&aAttempting to leap.')
    rightClick();
}).unregister();

register("worldUnload", () => {
    leaplocation = null
    leaptarget = null
})

// Config Triggers.
register("renderOverlay", () => {
    if (config().fastLeapGui.isOpen() && !config().fastLeapGui) {
        text.setString(`&6Leap Target: &a${Player.getName()} &7| &dCore!`)
        text.setScale(data.fastLeapGui.scale)
        text.setShadow(true)
        text.draw(data.fastLeapGui.x, data.fastLeapGui.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (config().fastLeapGui.isOpen() && (bn != 2)) {
        data.fastLeapGui.x = x
        data.fastLeapGui.y = y
        data.save()
    }
})

register("scrolled", (x, y, dir) => {
    if (config().fastLeapGui.isOpen()) {
        if (dir == 1) data.fastLeapGui.scale += 0.05
        else data.fastLeapGui.scale -= 0.05
        data.save()
    }
})

register("guiMouseClick", (x, y, bn) => {
    if (config().fastLeapGui.isOpen() && (bn == 2)) {
        data.fastLeapGui.x = Renderer.screen.getWidth() / 2
        data.fastLeapGui.y = Renderer.screen.getHeight() / 2 + 10
        data.fastLeapGui.scale = 1
        data.save()
    }
})

export function toggle() {
    if (config().fastLeapToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Fast Leap &amodule.")
        if (config().leapGuiToggle) renderTrigger.register()
        p3Locations.register()
        handleClick.register()
        openMenuTrigger.register()
        maxorEnd.register()
        stormEnd.register()
        goldorEnd.register()
        necronEnd.register()
        relicPickup.register()
        doorTrigger.register()
        return
    } 
    if (config().debug) chat("&cStopping the &6Fast Leap &cmodule.")
    if (!config().leapGuiToggle) renderTrigger.unregister()
    p3Locations.unregister()
    handleClick.unregister()
    openMenuTrigger.unregister()
    maxorEnd.unregister()
    stormEnd.unregister()
    goldorEnd.unregister()
    necronEnd.unregister()
    relicPickup.unregister()
    doorTrigger.unregister()
    return
}
export default { toggle };