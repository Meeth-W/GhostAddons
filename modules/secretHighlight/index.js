import config from "../../config";
import { chat, isInArray } from "../../utils/utils";

import { renderBlockHitbox } from "../../../BloomCore/RenderUtils";

let recentInteractions = [];

const renderBlockHighlight = (block, r, g, b) => {
    renderBlockHitbox(block, r, g, b, 1, true, 2, false)
    renderBlockHitbox(block, r, g, b, 0.2, true, 2, true)
}

const trigger = register('playerInteract', (action, pos, event) => {
    let pushInteract = true
    let clickString = "Interacted!"

    if (action.toString() !== "RIGHT_CLICK_BLOCK") return;

    let blockID = Player.lookingAt().getType().getID();

    if (blockID !== 54 && blockID !== 144 &&blockID !== 69) return; 
    if (blockID === 144) {
        const Range = 10;
        const witheressence = "26bb1a8d-7c66-31c6-82d5-a9c04c94fb02";
        const redstonekey = "edb0155f-379c-395a-9c7d-1b6005987ac8";

        const MoveObject = Player.getPlayer().func_174822_a(Range , 1.0);
        const CheckBlockPos = MoveObject?.func_178782_a()

        if (!CheckBlockPos) return;

        const TargetSkull = World.getWorld().func_175625_s(CheckBlockPos);
        if ((TargetSkull?.func_152108_a()?.id?.toString() === witheressence)) {
            pushInteract = true
            clickString = `${config.secretHighlightText} Essence!`

        } else if (TargetSkull?.func_152108_a()?.id?.toString() === redstonekey) {
            pushInteract = true
             clickString = `${config.secretHighlightText} Key!`
        } else {
            pushInteract = false
        }
    } else if (blockID === 54){
         clickString = `${config.secretHighlightText} Chest!`
    } else if (blockID === 69) {
         clickString = `${config.secretHighlightText} Lever!`
    }

    if (!pushInteract) return

    let coords = [pos.x, pos.y, pos.z, blockID, clickString];
    if (isInArray(coords, recentInteractions)) return;
    recentInteractions.push(coords);

    setTimeout(() => { recentInteractions.shift() }, parseInt(config.secretHighlightDelay))

}).unregister();

const renderTrigger = register('renderWorld', () => {
    if (!recentInteractions.length) return;

    recentInteractions.forEach(coords => {
        const [x, y, z, blockID, clickString] = coords;
        const block = World.getBlockAt(x, y, z)

        renderBlockHighlight(block, config.secretHighlightColor.getRed()/255, config.secretHighlightColor.getGreen()/255, config.secretHighlightColor.getBlue()/255)
        Tessellator.drawString(clickString, x+0.5, y+0.5, z+0.5, config.secretHighlightTextColor.getRGB(), true, 0.025, false)

    })
}).unregister();

export function toggle() {
    if (config.secretsToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Secret Highlight &amodule.")
        if (config.secretHighlightToggle) {
            trigger.register()
            renderTrigger.register()
        }
        return
    }
    if (config.debug) chat("&cStopping the &6Secret Highlight &cmodule.")
    if (!config.secretHighlightToggle) {
        trigger.unregister()
        renderTrigger.unregister()
    }
    return
}
export default { toggle };