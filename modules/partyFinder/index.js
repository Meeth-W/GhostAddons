import config from "../../config";
import playerData from "../../utils/player";
import { chat, prefix, queueChat } from "../../utils/utils";

let isleader = false

register("command", (username) => {
    if (!username) username = Player.getName()
    let player = new playerData(username, "Mage", 50, true) // Defaulting to Mage 50 cuz this is dependant and updates later anyway.
    chat(player.getString().join("\n"), 6969)
    try { player.init().then(() => {
        ChatLib.clearChat(6969)
        chat(player.getString().join("\n"), 6969)
        player.updateRest().then(() => {
            ChatLib.clearChat(6969)
            chat(player.getString().join("\n"), 6969)
            new Message(new TextComponent(prefix + `&c&l[&r&cClick To Invite&c&l]`).setHover(
                "show_text",
                `&c/party invite ${username}`
            ).setClick('run_command', `/party invite ${username}`)).chat()
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}
}).setName("nicepb").setAliases("m7stats");

const leadCheck = register('chat', (rank, leader) => {
    if ( leader == Player.getName() ) { isleader = true} 
    else { isleader = false }
}).setCriteria("Party Leader: ${rank} ${leader} ●").unregister()

const trigger = register("chat", (username, dungeonClass, classLevel) => {
    chat("&cTrigger")
    let player = new playerData(username, dungeonClass, classLevel)
    chat(player.getString().join("\n"), 6969)
    try { player.init().then(() => {
        ChatLib.clearChat(6969)
        chat(player.getString().join("\n"), 6969)

        if ( config.partyFinderAutoKick && player.toKick[0]) {
            player.kicked = true
            queueChat.queueCommands([
                () => {if (config.partyFinderPartyChat) ChatLib.command(`party chat [GH] Kicking Player: ${player.toKick[1]}`)},
                () => {if (isleader) ChatLib.command(`party kick ${username}`)}
            ])
            if (!isleader) chat("&cCancelling Auto-Kick, Not party leader.")
        }

        player.updateRest().then(() => {
            ChatLib.clearChat(6969)
            chat(player.getString().join("\n"), 6969)

            new Message(new TextComponent(prefix + `&c&l[&r&cClick To Kick&c&l]`).setHover(
                "show_text",
                `&c/party kick ${username}`
            ).setClick('run_command', `/party kick ${username}`)).chat()

            if ( config.partyFinderAutoKick && !player.kicked && player.toKick[0]) {
                player.kicked = true
                queueChat.queueCommands([
                    () => {if (config.partyFinderPartyChat) ChatLib.command(`party chat [GH] Kicking Player: ${player.toKick[1]}`)},
                    () => {if (isleader) ChatLib.command(`party kick ${username}`)}
                ])
                if (!isleader) chat("&cCancelling Auto-Kick, Not party leader.")
            }

            if (config.partyFinderPartyChat && !player.toKick[0] && !player.kicked) {
                queueChat.queueCommands([
                    () => {ChatLib.command(`party chat [GH] [${parseInt(player.stats.sb_level_raw)}] ${username} | Floor PB: ${player.getSelectPB()[1]['S+']} | Highest Magical Power: ${player.stats.magical_power.mp} | SPR: ${(player.stats.dungeons.secrets / player.stats.dungeons.runs).toFixed(2)}`)}
                ])
            }
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}

}).setCriteria("Party Finder > ${username} joined the dungeon group! (${dungeonClass} Level ${classLevel})").unregister();

export function toggle() {
    if (config.partyFinderToggle && config.toggle) {
        chat("&aStarting the &6Party Finder &amodule.")
        leadCheck.register()
        trigger.register()
        return
    }
    chat("&cStopping the &6Party Finder &cmodule.")
    leadCheck.unregister()
    trigger.unregister()
    return
}
export default { toggle };