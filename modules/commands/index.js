import { addBlacklist, addWhitelist, unBlacklist, unWhitelist, prefix } from "../../utils/utils"
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

export function toggle() {
    if (config().toggle) {
        if (config().debug) chat("&aStarting the &6Commands &amodule.")
        main.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Commands &cmodule.")
        main.unregister()
        return
}
export default { toggle };