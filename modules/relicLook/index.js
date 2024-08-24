import config from "../../config";
import { calcYawPitch, chat, snapTo } from "../../utils/utils";

const trigger = register("chat", (message) => {
    if (ChatLib.removeFormatting(ChatLib.getChatMessage(message)).includes("Orange")) {
        const regex = /\b(\w+) picked the Corrupted Orange Relic!/;

        let match =  ChatLib.removeFormatting(ChatLib.getChatMessage(message)).match(regex)
        if (match[1] !== Player.getName()) return;
        chat("&aRotating towards &6Orange")
        const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43});
        snapTo(yaw, pitch);
    }
    if (ChatLib.removeFormatting(ChatLib.getChatMessage(message)).includes("Red")) {
        const regex = /(\w+) picked the Corrupted Red Relic!/;
    
        let match =  ChatLib.removeFormatting(ChatLib.getChatMessage(message)).match(regex)
        if (match[1] !== Player.getName()) return;
        chat("&aRotating towards &cRed")
        const [yaw, pitch] = calcYawPitch({ x: 51, y: 7.5, z: 42});
        snapTo(yaw, pitch);
    }
}).setCriteria("picked the Corrupted").setContains().unregister();

export function toggle() {
    if (config().relicToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Relic &amodule.")
        trigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Relic &cmodule.")
    trigger.unregister()
    return
}
export default { toggle };