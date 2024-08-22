import config from "../../config";
import { chat, isInDungeon, rightClick } from "../../utils/utils";

let alreadyClicked = []
let attack = new KeyBind(Client.getMinecraft().field_71474_y.field_74312_F)
let senduseitem = new KeyBind(Client.getMinecraft().field_71474_y.field_74313_G)

let blackList = [[62, 135, 142], [62, 134, 142], [61, 136, 142], [61, 135, 142], [61, 134, 142], [61, 133, 142], [60, 136, 142], [60, 133, 142], [59, 136, 142], [59, 135, 142], [59, 134, 142], [59, 133, 142], [58, 135, 142], [58, 134, 142] ]

const trigger = register("tick", () => {
    if (!isInDungeon()) return;
    if (senduseitem.isKeyDown()) return;
    if (attack.isKeyDown() && !config.stonkInteract) return;

    let delay = config.secretDelay && !isNaN(parseInt(config.secretDelay)) ? parseInt(config.secretDelay) : 50;
    let click = false

    let blockID = Player.lookingAt()?.getType()?.getID();
    let x = Player.lookingAt().x
    let y = Player.lookingAt().y
    let z = Player.lookingAt().z

    if (blackList.some(coords => coords.every((val, index) => val === [x, y, z][index]))) return;
    if (alreadyClicked.some(coords => coords.every((val, index) => val === [x, y, z][index]))) return;

    if (blockID === 144) {
        const Range = 10;
        const witheressence = "26bb1a8d-7c66-31c6-82d5-a9c04c94fb02";
        const redstonekey = "edb0155f-379c-395a-9c7d-1b6005987ac8";
        const MoveObject = Player.getPlayer().func_174822_a(Range, 1.0);
        const CheckBlockPos = MoveObject?.func_178782_a()
        if (!CheckBlockPos) return;

        const TargetSkull = World.getWorld().func_175625_s(CheckBlockPos);

        if ((TargetSkull?.func_152108_a()?.id?.toString() === witheressence) || (TargetSkull?.func_152108_a()?.id?.toString() === redstonekey)) {
            click = true
        }

    } else if (blockID === 54 || blockID === 69 || blockID === 146) {
        click = true
    }

    if (click) {
        alreadyClicked.push([x, y, z])
        setTimeout(() => {
            rightClick()
            World.playSound(config.secretClickSound, 1, 1)
        }, delay)
    }
}).unregister();

export function toggle() {
    if (config.secretsToggle && config.toggle && config.cheatToggle) {
        if (config.debug) chat("&aStarting the &6Secret Triggerbot &amodule.")
        if (config.secretTriggerbot) {
            trigger.register()
        }
        return
    }
    if (config.debug) chat("&cStopping the &6Secret Triggerbot &cmodule.")
    if (!config.secretTriggerbot) {
        trigger.unregister()
    }
    return
}
export default { toggle };