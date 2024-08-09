import config from "../../config";
import { data } from "../../utils/data";
import { chat, isHoldingLeapItem, rightClick } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let leaplocation = null
let item
let text = new Text('').setScale(1).setShadow(true).setAlign('LEFT').setColor(Renderer.WHITE);

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
                if (config.leappchatToggle) ChatLib.command(`pc Leaping to ${leaplocation}`)
                leaptarget = null
                leaplocation = null
            }
        }
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister();

// Setting Target
const setTarget = register("chat", (n, a, p) => {
    if (n.toLowerCase() == Player.getName().toLowerCase()) return
    leaptarget = n
    leaplocation = p
    startTime = Date.now()
}).setCriteria(/Party > .+ (\w+): (At|Inside) (.+)(!)?/).unregister();

const renderTrigger = register('renderOverlay', () => {
    text.setString(getString())
    text.setScale(data.fastLeapGui.scale)
    text.draw(data.fastLeapGui.x, data.fastLeapGui.y)
}).unregister();

// Handle Leap Click
const handleClick = register(Java.type("net.minecraftforge.client.event.MouseEvent"), (event) => {
    if (event.button != 0 || !isHoldingLeapItem() || waitingLeap || !event.buttonstate || !Client.isTabbedIn()) return
    if (!leaptarget) return chat(`&cNo Leap Targets.`)
    
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
    if (config.fastLeapGui.isOpen() && !config.fastLeapGui) {
        text.setString(`&6Leap Target: &a${Player.getName()} &7| &dCore!`)
        text.setScale(data.fastLeapGui.scale)
        text.draw(data.fastLeapGui.x, data.fastLeapGui.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (config.fastLeapGui.isOpen() && (bn != 2)) {
        data.fastLeapGui.x = x
        data.fastLeapGui.y = y
        data.save()
    }
})

register("scrolled", (x, y, dir) => {
    if (config.fastLeapGui.isOpen()) {
        if (dir == 1) data.fastLeapGui.scale += 0.05
        else data.fastLeapGui.scale -= 0.05
        data.save()
    }
})

register("guiMouseClick", (x, y, bn) => {
    if (config.fastLeapGui.isOpen() && (bn == 2)) {
        data.fastLeapGui.x = Renderer.screen.getWidth() / 2
        data.fastLeapGui.y = Renderer.screen.getHeight() / 2 + 10
        data.fastLeapGui.scale = 1
        data.save()
    }
})

export function toggle() {
    if (config.fastLeapToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Fast Leap &amodule.")
        renderTrigger.register()
        setTarget.register()
        handleClick.register()
        openMenuTrigger.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Fast Leap &cmodule.")
    renderTrigger.unregister()
    setTarget.unregister()
    handleClick.unregister()
    openMenuTrigger.unregister()
    return
}
export default { toggle };