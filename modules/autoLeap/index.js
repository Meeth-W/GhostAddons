import config from "../../config";
import { chat, getClasses, rightClick, prefix } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let classes = ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank'];

let goldorSection = 0
let earlyEnterConfirm = false

const openLeap = () => {
    leapSlot = Player.getInventory().getItems().findIndex(a => a?.getName()?.removeFormatting() === "Infinileap")
    if (leapSlot > 7 || leapSlot < 0) { chat("Leap Not Found in Hotbar"); return } else {
        heldItem = Player.getHeldItemIndex()
        waitingLeap = true
        Player.setHeldItemIndex(leapSlot)
        Client.scheduleTask(0, () => {
            rightClick()
        })
        Client.scheduleTask(3, () => {
            Player.setHeldItemIndex(heldItem)
        })
    }
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const openMenuTrigger = register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === leaptarget.toLowerCase()) // Gets the slot to click
        setTimeout(() => {
            Player.getContainer().click(item)
        }, 100);
        chat(`Leaping to &6${leaptarget}`)
        leaptarget = null;
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister()

const i4Trigger = register("chat", (name) => {
    if (name !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) {
        leaptarget = getClasses()[classes[config().autoLeapTarget]]
        setTimeout(() => {
            openLeap()
        }, 150);
    }
}).setCriteria('${name} completed a device!').unregister()

const relicTrigger =  register("chat", (username, relic) => {
    if ((relic == 'Red' || relic == 'Orange') || username != Player.getName()) return
    leaptarget = getClasses()[classes[config().autoLeapRelicTarget]];
    setTimeout(() => {
        openLeap()
    }, 150);
}).setCriteria('${username} picked the Corrupted ${relic} Relic!').unregister();

const doorTrigger = register("chat", (user) => {
    if (user == Player.getName()) return
    leaptarget = user
    openLeap();
}).setCriteria("${user} opened a WITHER door!").unregister()

const goldorStart = register("chat", () => {
    leaptarget = getLeapTarget(goldorSection);
    goldorSection = 1;

    if (!leaptarget) return

    chat('Storm End | Leaping to Goldor Section: 1')
    openLeap();
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.").unregister();

const handleConfirmation = register("chat", (n, a, p) => {
    if (n.toLowerCase() == Player.getName().toLowerCase()) return;
    earlyEnterConfirm = true;
    if (config().autoLeapUseMessageTarget) leaptarget = n;
}).setCriteria(/Party > .+ (\w+): (At|Inside) (.+)(!)?/).unregister();

const goldorEnd = register("chat", () => {
    goldorSection = 0;
}).setCriteria(`The Core entrance is opening!`).unregister();

const termTrigger = register("chat", () => {
    goldorSection += 1; // Increment Goldor Phase 

    if (config().autoLeapWaitConfirmation && !earlyEnterConfirm) return chat('&cCancelled Leap: &7No Early Enter Confirmation Detected.')
    if (!leaptarget) leaptarget = getLeapTarget(goldorSection); // Manually get target if autoLeapUseMessageTarget was off
    if (!leaptarget) return; 

    chat(`Section End | Leaping to Goldor Section: ${(goldorSection == 5)? "Tunnel": goldorSection}`)
    openLeap();

    earlyEnterConfirm = false;
}).setCriteria(/^(\w{3,16}) \w{9,9} a \w{6,11}! \(?(?:7\/7|8\/8)\)$/).unregister();

const getLeapTarget = (goldorS) => {
    let target = null
    if (goldorS == 0 && config().autoLeapSS != 5) {target = getClasses()[classes[config().autoLeapSS]]} // S1
    else if (goldorS == 1 && config().autoLeapEE2 != 5) {target = getClasses()[classes[config().autoLeapEE2]]} // S2
    else if (goldorS == 2 && config().autoLeapEE3 != 5) {target = getClasses()[classes[config().autoLeapEE3]]} // S3
    else if (goldorS == 3 && config().autoLeapCore != 5) {target = getClasses()[classes[config().autoLeapCore]]} // S4 
    else if (goldorS == 4 && config().autoLeapTunnel != 5) {target = getClasses()[classes[config().autoLeapTunnel]]} // Tunnel

    if (target.toLowerCase() == Player.getName().toLowerCase()) return null
}


let ticks 
const tickCounter = register("packetReceived", () => {
    chat(`${prefix} &7Leaping In: &a${(ticks/20).toFixed(2)}s`, 6969)
    ticks--
    if (ticks <= 0) {
        tickCounter.unregister();
        leaptarget = getClasses()[classes[config().autoLeapMidClass]];
        openLeap();
        ChatLib.clearChat(6969)
    }
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

const necronStart = register("chat", () => {
    chat('Starting Necron Timer.')
    ticks = isNaN(parseInt(config().autoLeapNecornDelay))? 60:60+parseInt(config().autoLeapNecornDelay)
    tickCounter.register();
}).setCriteria(`[BOSS] Necron: I'm afraid, your journey ends now`).unregister();

// Debug Commands: Ill remove this shit later
register("command", (section) => {
    if (section) {
        goldorSection = section
        chat(`Set Goldor Section To: &a${goldorSection}`)
    } else {
        chat(`Current Section: ${goldorSection}`)
        chat(`Current Leap Target: ${getLeapTarget(goldorSection)}`)
    }
}).setName("setSection")

register("command", (name) => {
    if (config().autoLeapToggle && config().toggle && config().cheatToggle) {
        leaptarget = name
        openLeap()
    } else { chat(`&cSetting Toggled Off.`)}
}).setName("autoleap")

export function toggle() {
    if (config().autoLeapToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Leap &amodule.")
        openMenuTrigger.register()
        if (config().autoLeapi4) i4Trigger.register()
        if (config().autoLeapWitherDoor) doorTrigger.register()
        if (config().autoLeaprelic) relicTrigger.register()
        if (config().autoLeapTerminals) {
            goldorStart.register();
            handleConfirmation.register();
            goldorEnd.register();
            termTrigger.register();
        }
        if (config().autoLeapMid) necronStart.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Leap &cmodule.")
    openMenuTrigger.unregister()
    i4Trigger.unregister()
    doorTrigger.unregister()
    relicTrigger.unregister()
    goldorStart.unregister();
    handleConfirmation.unregister();
    goldorEnd.unregister();
    termTrigger.unregister();
    necronStart.unregister();
    return
}
export default { toggle };