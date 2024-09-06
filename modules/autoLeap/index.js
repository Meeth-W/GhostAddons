import config from "../../config";
import { chat, getClasses, rightClick } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let classes = ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank'];

const openLeap = () => {
    let leapSlot = parseInt(Player.getInventory().indexOf(Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting() == "Infinileap")?.getID()))
    if ( leapSlot > 7 || leapSlot < 0) return chat(`&4Leap Not Found in Hotbar`)
    let heldItem = Player.getHeldItemIndex();
    waitingLeap = true
    Client.scheduleTask(0, () => { Player.setHeldItemIndex(leapSlot)})
    Client.scheduleTask(1, () => {
        chat(`Opening Leap Menu!`)
        rightClick()
    })
    Client.scheduleTask(3, () => { Player.setHeldItemIndex(heldItem) })
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const openMenuTrigger = register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        let playerToLeapTo;
        if (!leaptarget) {
            playerToLeapTo = getClasses()[classes[config().autoLeapTarget]]
        } else { playerToLeapTo = leaptarget }

        const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === playerToLeapTo.toLowerCase()) // Gets the slot to click
        Player.getContainer().click(item)
        chat(`Leaping to &6${playerToLeapTo}`)
        leaptarget = null;
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister()

const i4Trigger = register("chat", (name) => {
    if (name !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) {
        openLeap()
    }
}).setCriteria(/^(\w{3,16}) completed a device! \(\d\/\d\)$/).unregister()

const relicTrigger =  register("chat", (username, relic) => {
    if ((relic == 'Red' || relic == 'Orange') || username != Player.getName()) return
    leaptarget = (getClasses()[classes[config().autoLeapRelicTarget]]);
    openLeap();
}).setCriteria('${username} picked the Corrupted ${relic} Relic!').unregister();

const doorTrigger = register("chat", (user) => {
    if (user == Player.getName()) return
    leaptarget = user
    openLeap()  
}).setCriteria("${user} opened a WITHER door!").unregister()

register("command", (name) => {
    if (config().autoLeapToggle && config().toggle && config().cheatToggle) {
        if (name) {leaptarget = name}
        clickLeap()
    } else { chat(`&cSetting Toggled Off.`)}
    
}).setName("autoleap")

export function toggle() {
    if (config().autoLeapToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Leap &amodule.")
        openMenuTrigger.register()
        if (config().autoLeapi4) i4Trigger.register()
        if (config().autoLeapWitherDoor) doorTrigger.register()
        if (config().autoLeaprelic) relicTrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Leap &cmodule.")
    openMenuTrigger.unregister()
    i4Trigger.unregister()
    doorTrigger.unregister()
    relicTrigger.unregister()
    return
}
export default { toggle };