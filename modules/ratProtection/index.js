import config from "../../config";
import request from "../../../requestV2";
import { chat } from "../../utils/utils";

const UUID = Java.type("java.util.UUID");

let isProtected = false;

const trigger = register("step", () => {
	trigger.setFps(config().ratProtectionamount);
	if (!config().ratProtectionToggle || !World.isLoaded()) return;
	jsv(Client.getMinecraft().func_110432_I().func_148254_d(), Player.getUUID().replaceAll("-", ""), UUID.randomUUID().toString().replaceAll("-", ""));
}).unregister();	

const overlay = register("renderOverlay", () => {
	if (!config().ratProtectionToggle || !config().ratProtectionoverlayEnabled) return;
	const text = isProtected ? "§7Rat Protection: §aEnabled!" : "§Rat Protection: §cLoading...";
	Renderer.drawStringWithShadow(text, Renderer.screen.getWidth() - Renderer.getStringWidth(text), Renderer.screen.getHeight() - 8);
}).unregister();

function jsv(token, uuidc, svid) {
	request({
		url: "https://sessionserver.mojang.com/session/minecraft/join",
		method: "POST",
		body: {
			accessToken: token,
			selectedProfile: uuidc,
			serverId: svid
		},
		resolveWithFullResponse: true
	}).then(response => {
		isProtected = response.statusCode !== 204;
	}).catch(() => {
		isProtected = true;
	});
}

export function toggle() {
    if (config().ratProtectionToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Rat Protection &amodule.")
        trigger.register()
        if (config().ratProtectionoverlayEnabled) overlay.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Rat Protection &cmodule.")
    trigger.unregister()
    if (!config().ratProtectionoverlayEnabled) overlay.unregister()
    return
}
export default { toggle };