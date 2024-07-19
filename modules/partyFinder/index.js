import config from "../../config";
import playerData from "../../utils/player";
import { chat } from "../../utils/utils";

const trigger = register("chat", (username, dungeonClass, classLevel) => {
    if(!config.partyFinderToggle) return

    let player = new playerData(username);
    chat(`&aGetting ${username}'s Stats.`, 6969)
    player.init().then(() => {
        ChatLib.clearChat(6969)
        let messages = getStatsMessage(player, dungeonClass, classLevel)
        chat(messages.join("\n"), 6969)

        if (player.toKick[0] && config.partyFinderAutoKick) {
            
        }
    })

}).setCriteria(/&dParty Finder &r&f> &r&\w(\w+) &r&ejoined the dungeon group! \(&r&b(\w+) Level (\w+)&r&e\)&r/).unregister();

function getStatsMessage(player, dungeonClass, classLevel) {
    return [
        `&${player.toKick[0]? "c":"a"}&l&m--------------------`,
        `&8[${(player.updated.rest)? player.stats.sb_level: "&r..."}&8] &6${player.username}`, // TODO: Rank Integration.
        `&c☠ Cata Level: &e${(player.updated.dungeons)? player.stats.experience.catacombs: "..."}`,
        ` `,
        `&f&l⚛&r &fClass Average: &e${(player.updated.rest)? player.stats.experience.classAverage: "..."}`,
        `&c☣ Archer Level: &e${(player.updated.rest)? player.stats.experience.classes.Archer:(dungeonClass == "Archer")? classLevel: "..."}`,
        `&6⚔ Berserk Level: &e${(player.updated.rest)? player.stats.experience.classes.Berserker:(dungeonClass == "Berserk")? classLevel: "..."}`,
        `&a❈ Tank Level: &e${(player.updated.rest)? player.stats.experience.classes.Tank:(dungeonClass == "Tank")? classLevel: "..."}`,
        `&b✎ Mage Level: &e${(player.updated.rest)? player.stats.experience.classes.Mage:(dungeonClass == "Mage")? classLevel: "..."}`,
        `&d❤ Healer Level: &e${(player.updated.rest)? player.stats.experience.classes.Healer:(dungeonClass == "Healer")? classLevel: "..."}`,
        ` `,
        `&7Magical Power: &6${(player.updated.rest)? player.stats.magical_power: "..."}`,
        `&7Secret Count: &6${(player.updated.dungeons)? player.stats.dungeons.secrets: "..."}`,
        `&aHighlighed PB: &6${(player.updated.dungeons)? player.getSelectPB()['S+']:"..."}`
        ` `,
        `&aTotal Completions: &6${player.stats.dungeons.runs}`,
        ` `,
        `&${player.toKick[0]? "c":"a"}&l&m--------------------`
    ]
}
export function enable() {
	trigger.register();
}

export function disable() {
	trigger.unregister();
}

export default { enable, disable };