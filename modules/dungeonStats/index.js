import config from "../../config";
import playerData from "../../utils/player";
import { chat } from "../../utils/utils";
import { getColor } from "../../utils/utils";

let showGUI = false
let player = null
let windowSize = 60

function getcol1() {
    return [
    `&d→     Experience`,
    ``,
    `&cCatacombs Level: &6${player.stats.experience.catacombs}`,
    ``,
    `&cClass Average: &6${player.stats.experience.classAverage}`,
    ``,
    `&cArcher Level: &6${player.stats.experience.classes.Archer}`,
    `&cBerserk Level: &6${player.stats.experience.classes.Berserk}`,
    `&cMage Level: &6${player.stats.experience.classes.Mage}`,
    `&cTank Level: &6${player.stats.experience.classes.Tank}`,
    `&cHealer Level: &6${player.stats.experience.classes.Healer}`,
    ``,
    `&cSelected Class: &6${player.stats.experience.selectedClass}`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    `&6Click ${Keyboard.getKeyName(closeKey.getKeyCode())} to Close.`
]}
function getcol2() {
    return [
    `&d→     Catacombs`,
    ``,
    `&cFloor 1: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['1']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f1: '...'}`,
    `&cFloor 2: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['2']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f2: '...'}`,
    `&cFloor 3: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['3']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f3: '...'}`,
    `&cFloor 4: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['4']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f4: '...'}`,
    `&cFloor 5: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['5']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f5: '...'}`,
    `&cFloor 6: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['6']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f6: '...'}`,
    `&cFloor 7: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['7']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.catacombs?.f7: '...'}`,
    ``,
    ``,
    `&d→     Master Mode`,
    ``,
    `&cFloor 1: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['1']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m1: '...'}`,
    `&cFloor 2: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['2']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m2: '...'}`,
    `&cFloor 3: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['3']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m3: '...'}`,
    `&cFloor 4: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['4']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m4: '...'}`,
    `&cFloor 5: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['5']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m5: '...'}`,
    `&cFloor 6: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['6']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m6: '...'}`,
    `&cFloor 7: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['7']['S+'] : "..."}  &c| &6${player?.updated?.rest? player?.stats?.completions?.master_catacombs?.m7: '...'}`,
]}
function getcol3() {
    return [
    `&d→     Miscellaneous`,
    ``,
    `&cMagical Power: &6${player.updated.rest? player.stats.magical_power.mp : "..."}`,
    `&cHighest Magical Power: &6${player.updated.rest? player.stats.magical_power.mp : "..."}`,
    `&cReforge: &6${player.updated.rest? player.stats.magical_power.reforge : "..."}`,
    ``,
    ``,
    `&cSecret Count: &6${player.updated.dungeons? player.stats.dungeons.secrets : "..."}`,
    `&cSecrets/Run: &6${player.updated.dungeons? (player.stats.dungeons.secrets/player.stats.dungeons.runs).toFixed(2) : '...'}`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    `&cKick Status`,
    `${player.toKick[0]? "&c":"&a"}${player.toKick[1]}`
]}
const commandRegister = register("command", (username) => {
    if (!config().toggle) return
    if (!config().partyFinderToggle) return
    if (!username) username = Player.getName()
    player = new playerData(username)
    showGUI = true;
    displaytime = null
    try { player.init().then(() => {
        player.updateRest().then(() => {
            displaytime = Date.now()
            setTimeout(() => {
                showGUI = false
                displaytime = null
            }, 100000);
            ChatLib.chat(player.getString().join('\n'))
            ChatLib.command(`ct copy [${parseInt(player.stats.sb_level_raw)}] ${username} | Floor PB: ${player.getSelectPB()[1]['S+']} | Highest Magical Power: ${player.stats.magical_power.mp} | Secrets: ${player.stats.dungeons.secrets}`, true)
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}
}).setName("nicepb").setAliases("m7stats");

register("command", (username) => {
    if (!config().toggle) return
    if (!config().partyFinderToggle) return
    if (!username) username = Player.getName()
    player = new playerData(username)
    try { player.init().then(() => {
        player.updateRest().then(() => {
            ChatLib.chat(player.getString().join('\n'))
            ChatLib.command(`ct copy [${parseInt(player.stats.sb_level_raw)}] ${username} | Floor PB: ${player.getSelectPB()[1]['S+']} | Highest Magical Power: ${player.stats.magical_power.mp} | Secrets: ${player.stats.dungeons.secrets}`, true)
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}
}).setName("dv");

const renderTrigger = register('renderOverlay', () => {
    if (!config().statsOverlay) return
    if (!showGUI) return

    const screenWidth = Renderer.screen.getWidth() / 2;
	const screenHeight = Renderer.screen.getHeight() / 2;

	const width = 12 * 18;
	const height = windowSize / 9 * 18;

	const globalOffsetX = Number.isNaN(parseInt(0)) ? 0 : parseInt(0);
	const globalOffsetY = Number.isNaN(parseInt(0)) ? 0 : parseInt(0);

	const offsetX = screenWidth / 2 - width / 2 + globalOffsetX + 1;
	const offsetY = screenHeight / 2 - height / 2 + globalOffsetY;

	const title = `&8[${player?.stats?.sb_level}&8] ${player.rank} ${player.username}&7's Dungeon Stats`;

    Tessellator.pushMatrix();
	Renderer.scale(2);
	Renderer.drawRect(getColor(config().m7StatsBackgroundColor).getRGB(), offsetX - 2, offsetY - 2, width + 4, height + 4);
	Renderer.scale(2);
	Renderer.drawStringWithShadow(title, offsetX, offsetY);

    Renderer.drawStringWithShadow(getcol1().join('\n'), offsetX*2, offsetY*2 + 30)
    Renderer.drawStringWithShadow(getcol2().join('\n'), offsetX*3.1, offsetY*2 + 30)
    Renderer.drawStringWithShadow(getcol3().join('\n'), offsetX*4.2, offsetY*2 + 30)
    
    Tessellator.popMatrix();
})

const closeKey = new KeyBind("Close GUI", Keyboard.KEY_LCONTROL, "GhostAddons");

closeKey.registerKeyPress(() => {
    if (!showGUI) return
    showGUI = false
});

export function toggle() {
    return commandRegister.register();
}
export default { toggle };