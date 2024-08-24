import config from "../../config";
import { chat, getClasses, rightClick } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let item

const openLeap = () => {
    let leapSlot = parseInt(Player.getInventory().indexOf(Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting() == "Infinileap")?.getID()))
    if ( leapSlot > 7 || leapSlot < 0) return chat(`&4Leap Not Found in Hotbar`)
    let heldItem = Player.getHeldItemIndex();
    waitingLeap = true
    Client.scheduleTask(0, () => { Player.setHeldItemIndex(leapSlot)})
    Client.scheduleTask(1, () => {
        chat(`&cAttempting to Leap...`)
        rightClick()
    })
    Client.scheduleTask(3, () => { Player.setHeldItemIndex(heldItem) })
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const openMenuTrigger = register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    let classes = ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank'];
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        const items = Player.getContainer()?.getItems() 
        for (let i = 0; i < items.length; i++) {
            item = (items[i]?.getName())?.substring(2)?.toLowerCase()
            if (leaptarget && item == leaptarget.toLowerCase()) {
                Player.getContainer().click(i)
                leaptarget = null
            } else if (item == (getClasses()[classes[config().autoLeapTarget]])) {
                Player.getContainer().click(i)
            }
        }
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister()

const i4Trigger = register("chat", (message) => {
    const match = message.match(/(.*) completed a device! \(\d\/\d\)/)
    if (match === null) return
    if (match[1] !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) {
        openLeap()
    }
}).setCriteria("${message}").unregister()

const doorTrigger = register("chat", (user) => {
    if (user == Player.getName()) return
    leaptarget = user
    openLeap()  
}).setCriteria("${user} opened a WITHER door!").unregister()

export function toggle() {
    if (config().autoLeapToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Leap &amodule.")
        openMenuTrigger.register()
        if (config().autoLeapi4) i4Trigger.register()
        if (config().autoLeapWitherDoor) doorTrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Leap &cmodule.")
    openMenuTrigger.unregister()
    if (config().autoLeapi4) i4Trigger.unregister()
    if (config().autoLeapWitherDoor) doorTrigger.unregister()
    return
}
export default { toggle };