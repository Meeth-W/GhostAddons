import { addBlacklist, addWhitelist, unBlacklist, unWhitelist, prefix, swapItem, chat, rightClick } from "../../utils/utils"
import { data } from "../../utils/data"
import config from "../../config"

const main = register("command", (...args) => {
    try {
        if (!args || !args[0]) {
            let messages = [
                `&6&m${ChatLib.getChatBreak(" ")}`,
                `&c- Whitelist & Blacklist Commands`,
                `&f/(cmd) whitelist &a- Displays the whitelist`,
                `&f/(cmd) whitelist add (user) &a- Adds player to whitelist`,
                `&f/(cmd) whitelist remove (user) &a- Removes player from whitelist`,
                `&f/(cmd) blacklist &a- Displays the blacklist`,
                `&f/(cmd) blacklist add (user) &a- Adds player to whitelist`,
                `&f/(cmd) blacklist remove (user) &a- Removes player from whitelist`,
                `&6&m${ChatLib.getChatBreak(" ")}`
            ]
            ChatLib.chat(messages.join("\n"))
        } else if (args[0].toLowerCase() == "blacklist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix}&cBlacklisted Players: &7` + data.partyFinder.igns.blacklist.join(", ")) 
                return
            } else if (args[1].toLowerCase() == "add") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                addBlacklist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                unBlacklist(args[2])
            } 
        } else if ( args[0].toLowerCase() == "whitelist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix}&aWhitelisted Players: &7` + data.partyFinder.igns.whitelist.join(", "))
                return
            } else if ( args[1].toLowerCase() == "add") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                addWhitelist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                unWhitelist(args[2])
            }
        }   
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("pfa").unregister()

const spray = register("command", (...args) => {
    if (!config().cheatToggle) return chat(`&cCheats are currently disabled.`)
    try {
        let held = Player.getHeldItemIndex(); 
        if (!swapItem('Ice Spray Wand')) return chat('&cSpray not in hotbar!')
        Client.scheduleTask(2, () => { rightClick(); })
        Client.scheduleTask(4, () => { Player.setHeldItemIndex(held); })
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("/spray").unregister()

const buff = register("command", (...args) => {
    if (!config().cheatToggle) return chat(`&cCheats are currently disabled.`)
    let checks = [true, true, true]
    try {
        if (!swapItem('Weirder Tuba')) {
            chat('&cTuba not in hotbar!')
            checks[0] = false
        }
        Client.scheduleTask(2, () => { if (checks[0]) rightClick(); })
        Client.scheduleTask(4, () => { if (!swapItem('Rogue Sword')) {
            chat('&cRouge Sword not in hotbar')
            checks[1] = false
        }}) 
        Client.scheduleTask(6, () => { if (checks[1]) rightClick(); })
        Client.scheduleTask(8, () => { if (!swapItem('Sword of Bad Health')) {
            chat('&cSword of Bad Health not in hotbar') 
            checks[2] = false
        }}) 
        Client.scheduleTask(10, () => { if (checks[2]) rightClick() })
        Client.scheduleTask(12, () => { if (!swapItem('Terminator')) chat('&cTerminator not in hotbar') }) 
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("/buff").unregister()

const restocking = register("command", (...args) => {
    restock();
}).setName("/restock").unregister()

export function getPearls() {
    const pearlStack = Player.getInventory().getItems().find(a => a?.getName() == "§fEnder Pearl")
    if (!pearlStack) { 
        return ChatLib.command(`gfs ender_pearl 16`, false)
    }
    const toGivePearl = 16 - pearlStack.getStackSize()
    if (toGivePearl != 0) { ChatLib.command(`gfs ender_pearl ${toGivePearl}`, false) }
}

export function getJerrys() {
    const jerryStack = Player.getInventory().getItems().find(a => a?.getName() == "§fInflatable Jerry")
    if (!jerryStack) {
        return ChatLib.command(`gfs inflatable_jerry 64`, false)
    }
    const toGiveJerry = 64 - jerryStack.getStackSize()
    if (toGiveJerry != 0) { ChatLib.command(`gfs inflatable_jerry ${toGiveJerry}`, false) }
}

export function restock() {
    chat('Replenishing Ender Pearls.')
    getPearls()
    setTimeout(() => {
        chat('Replenishing Inflatable Jerrys.');
        getJerrys();
    }, 3000)
}

export function toggle() {
    if (config().toggle) {
        if (config().debug) chat("&aStarting the &6Commands &amodule.")
        main.register()
        spray.register()
        restocking.register();
        buff.register();
        return
    }
    if (config().debug) chat("&cStopping the &6Commands &cmodule.")
    main.unregister()
    spray.unregister()
    restocking.unregister()
    buff.unregister()
    return
}
export default { toggle };