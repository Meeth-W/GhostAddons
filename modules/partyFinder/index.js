import config from "../../config";
import playerData from "../../utils/player";
import { chat, prefix, queueChat } from "../../utils/utils";
let isleader = false

const leadCheck = register('chat', (rank, leader) => {
    if ( leader == Player.getName() ) { isleader = true} 
    else { isleader = false }
}).setCriteria("Party Leader: ${rank} ${leader} ●").unregister()

const leadChecktransfer = register('chat', (rank, name, username) => {
    if (username == Player.getName() ) { isleader = false}
    else isleader = true
}).setCriteria("The party was transferred to ${rank} ${username} by ${rank} ${name}").unregister();

const leadChecklost = register('chat', (rank, name, username) => {
    if (username == Player.getName() ) { isleader = false}
}).setCriteria("The party was transferred to ${rank} ${name} by ${rank} ${username}").unregister();

const trigger = register("chat", (username, _, __) => {
    let player = new playerData(username)
    World.playSound(`note.pling`, 1, 1)
    chat(player.getString().join("\n"), 6969)
    try { player.init().then(() => {
        ChatLib.clearChat(6969)
        chat(player.getString().join("\n"), 6969)
        
        if ( config().partyFinderAutoKick && player.toKick[0]) {
            player.kicked = true
            queueChat.queueCommands([
                () => {if (config().partyFinderPartyChat && isleader) ChatLib.command(`party chat Kicking Player: ${player.toKick[1]}`)},
                () => {if (isleader) ChatLib.command(`party kick ${username}`)}
            ])
        if (!isleader) chat("&cCancelling Auto-Kick, Not party leader.")

        }

        player.updateRest().then(() => {
            ChatLib.clearChat(6969)
            chat(player.getString().join("\n"), 6969)
            ChatLib.command(`ct copy  [${parseInt(player.stats.sb_level_raw)}] ${username} | Floor PB: ${player.getSelectPB()[1]['S+']} | Highest Magical Power: ${player.stats.magical_power.mp} | Secrets: ${player.stats.dungeons.secrets}`, true)
            new Message(new TextComponent(prefix + `&c&l[&r&cClick To Kick&c&l]`).setHover(
                "show_text",
                `&c/party kick ${username}`
            ).setClick('run_command', `/party kick ${username}`)).chat()

            if ( config().partyFinderAutoKick && !player.kicked && player.toKick[0]) {
                player.kicked = true
                queueChat.queueCommands([
                    () => {if (config().partyFinderPartyChat && isleader) ChatLib.command(`party chat Kicking Player: ${player.toKick[1]}`)},
                    () => {if (isleader) ChatLib.command(`party kick ${username}`)}
                ])
            if (!isleader) chat("&cCancelling Auto-Kick, Not party leader.")

            }

            if (config().partyFinderPartyChat && !player.toKick[0] && !player.kicked && !config().partyFinderOnlyKickMessage) {
                queueChat.queueCommands([
                    () => {ChatLib.command(`party chat [${parseInt(player.stats.sb_level_raw)}] ${username} | Floor PB: ${player.getSelectPB()[1]['S+']} | Highest Magical Power: ${player.stats.magical_power.mp} | Secrets: ${player.stats.dungeons.secrets}`)}
                ])
            }
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}

}).setCriteria("Party Finder > ${username} joined the dungeon group! (${dungeonClass} Level ${classLevel})").unregister();

export function toggle() {
    if (config().partyFinderToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Autokick &amodule.")
        leadCheck.register()
        leadChecktransfer.register()
        leadChecklost.register()
        trigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Autokick &cmodule.")
    leadCheck.unregister()
    leadChecktransfer.unregister()
    leadChecklost.unregister()
    trigger.unregister()
    return
}
export default { toggle };