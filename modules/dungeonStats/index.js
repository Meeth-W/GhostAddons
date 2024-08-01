import config from "../../config";
import playerData from "../../utils/player";
import { chat } from "../../utils/utils";

let showGUI = false
let player = null
let windowSize = 60

function getcol1() {
    return [
    `&d     Experience`,
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
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``
]}
function getcol2() {
    return [
    `&d     Catacombs PB`,
    ``,
    `&cFloor 1: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['1']['S+'] : "..."}`,
    `&cFloor 2: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['2']['S+'] : "..."}`,
    `&cFloor 3: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['3']['S+'] : "..."}`,
    `&cFloor 4: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['4']['S+'] : "..."}`,
    `&cFloor 5: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['5']['S+'] : "..."}`,
    `&cFloor 6: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['6']['S+'] : "..."}`,
    `&cFloor 7: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.catacombs['7']['S+'] : "..."}`,
    ``,
    ``,
    `&d     Master Mode PB`,
    ``,
    `&cFloor 1: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['1']['S+'] : "..."}`,
    `&cFloor 2: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['2']['S+'] : "..."}`,
    `&cFloor 3: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['3']['S+'] : "..."}`,
    `&cFloor 4: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['4']['S+'] : "..."}`,
    `&cFloor 5: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['5']['S+'] : "..."}`,
    `&cFloor 6: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['6']['S+'] : "..."}`,
    `&cFloor 7: &6${player.updated.dungeons? player?.stats?.dungeons?.pb?.master_catacombs['7']['S+'] : "..."}`,
]}
function getcol3() {
    return [
    `&d     Miscellaneous`,
    ``,
    `&cMagical Power: &6${player.updated.rest? player.stats.magical_power.mp : "..."}`,
    `&cHighest Magical Power: &6${player.updated.rest? player.stats.magical_power.mp : "..."}`,
    `&cReforge: &6${player.updated.rest? player.stats.magical_power.reforge : "..."}`,
    ``,
    ``,
    `&cSecret Count: &6${player.updated.dungeons? player.stats.dungeons.secrets : "..."}`,
    `&cSecrets/run: __`,
    ``,
    ``,
    `&cPurse: &6201.5m`,
    `&cBank: &61b`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``
]}
const commandRegister = register("command", (username) => {
    if (!username) username = Player.getName()
    player = new playerData(username) // Defaulting to Mage 50 cuz this is dependant and updates later anyway.
    showGUI = true;
    try { player.init().then(() => {
        player.updateRest().then(() => {
            setTimeout(() => {
                showGUI = false
            }, 5000);
        })
    }) } catch(e) {chat(`&cError: ${e.reason}`)}
}).setName("nicepb").setAliases("m7stats");

const renderTrigger = register('renderOverlay', () => {
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
	Renderer.drawRect(config.m7StatsBackgroundColor.getRGB(), offsetX - 2, offsetY - 2, width + 4, height + 4);
	Renderer.scale(2);
	Renderer.drawStringWithShadow(title, offsetX, offsetY);

    Renderer.drawStringWithShadow(getcol1().join('\n'), offsetX*2, offsetY*2 + 30)
    Renderer.drawStringWithShadow(getcol2().join('\n'), offsetX*3.1, offsetY*2 + 30)
    Renderer.drawStringWithShadow(getcol3().join('\n'), offsetX*4.2, offsetY*2 + 30)

    Tessellator.popMatrix();
})

export function toggle() {
    // if (config.m7StatsToggle && config.toggle) {
    //     if (config.debug) chat("&aStarting the &6Dungeon Stats &amodule.")
    //     commandRegister.register()
    //     return
    // }
    // if (config.debug) chat("&cStopping the &6Dungeon Stats &cmodule.")
    // commandRegister.unregister()
    return commandRegister.register();
}
export default { toggle };