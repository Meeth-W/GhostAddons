import { renderBlockHitbox } from "../../../BloomCore/RenderUtils";
import { getEtherwarpBlock, holdingAOTV } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { chat, isInArray, rightClick } from "../../utils/utils";

let lastTP = null
let recentTPs = []

const trigger = register('tick', () => {
    if (!Player.isSneaking() || new Date().getTime() - lastTP < config.etherDelay || !holdingAOTV()) return
    const etherBlock = getEtherwarpBlock(true)
    if (!etherBlock) return
    if (isInArray(etherBlock, recentTPs)) return
    const [x, y, z] = etherBlock
    let blocks = new Set(config.etherBlocks.split(", ").map(elm => 'minecraft:' + elm))
    if (!blocks.has(World.getBlockAt(x, y, z).type.getRegistryName())) return
    recentTPs.push(etherBlock)
    lastTP = new Date().getTime()
    rightClick()
    if (config.etherDing) World.playSound('note.pling', 1, 1);
    setTimeout(() => { recentTPs.shift() }, 1000)  
}).unregister();

const renderTrigger = register('renderWorld', () => {
    if (!recentTPs.length) return;

    recentTPs.forEach(coords => {
        const [x, y, z] = coords;
        const block = World.getBlockAt(x, y, z)
        
        renderBlockHitbox(block, config.autoEtherColor.getRed()/255, config.autoEtherColor.getGreen()/255, config.autoEtherColor.getBlue()/255, config.autoEtherColor.getAlpha()/255, true, 2, true)
        Tessellator.drawString('Teleported!', x+0.5, y+0.5, z+0.5, config.autoEtherTextColor.getRGB(), true, 0.025, false)

    })
}).unregister();

export function toggle() {
    if (config.secretsToggle && config.toggle && config.cheatToggle) {
        if (config.debug) chat("&aStarting the &6Auto Etherwarp &amodule.")
        if (config.autoEtherToggle) {
            trigger.register()
            renderTrigger.register()
        }
        return
    }
    if (config.debug) chat("&cStopping the &6Auto Etherwarp &cmodule.")
    if (!config.autoEtherToggle) {
        trigger.unregister()
        renderTrigger.unregister()
    }
    return
}
export default { toggle };