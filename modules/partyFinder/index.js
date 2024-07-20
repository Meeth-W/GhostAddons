import config from "../../config";
import playerData from "../../utils/player";
import { chat } from "../../utils/utils";

const trigger = register("chat", (username, dungeonClass, classLevel) => {
    chat("&cTrigger")
    let player = new playerData(username)
    chat(player.getString(dungeonClass, classLevel).join("\n"), 6969)
    try { player.init().then(() => {
        ChatLib.clearChat(6969)
        chat(player.getString(dungeonClass, classLevel).join("\n"), 6969)

        if ( config.partyFinderAutoKick && player.toKick[0]) {
            chat("&cKicking Player: &r" + player.toKick[1])
            player.kicked = true
        }

        player.updateRest().then(() => {
            ChatLib.clearChat(6969)
            chat(player.getString(dungeonClass, classLevel).join("\n"), 6969)

            if ( config.partyFinderAutoKick && !player.kicked && player.toKick[0]) {
                chat("&cKicking Player: &r" + player.toKick[1])
                player.kicked = true
            }
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}

}).setCriteria("Party Finder > ${username} joined the dungeon group! (${dungeonClass} Level ${classLevel})").unregister();

export function toggle() {
    if (config.partyFinderToggle && config.toggle) {
        chat("&aStarting the &6Party Finder &amodule.")
        return trigger.register()
    }
    chat("&cStopping the &6Party Finder &cmodule.")
    return trigger.unregister()
}
export default { toggle };