import config from "../../config";
import { chat, rightClick } from "../../utils/utils";

const DevBlocks = [
    { x: 64, y: 126, z: 50 },
    { x: 66, y: 126, z: 50 },
    { x: 68, y: 126, z: 50 },
    { x: 64, y: 128, z: 50 },
    { x: 66, y: 128, z: 50 },
    { x: 68, y: 128, z: 50 },
    { x: 64, y: 130, z: 50 },
    { x: 66, y: 130, z: 50 },
    { x: 68, y: 130, z: 50 }
];


let lastShot

function getEyePos() {
    return {
        x: Player.getX(),
        y: Player.getY() + Player.getPlayer().func_70047_e(),
        z: Player.getZ()
    };
}

function snapTo(yaw, pitch) {
    const player = Player.getPlayer();

    player.field_70177_z = yaw
    player.field_70125_A = pitch;
}

function calcYawPitch(blcPos, plrPos) {
    if (!plrPos) plrPos = getEyePos();
    let d = {
        x: blcPos.x - plrPos.x,
        y: blcPos.y - plrPos.y,
        z: blcPos.z - plrPos.z
    };
    let yaw = 0;
    let pitch = 0;
    if (d.x != 0) {
        if (d.x < 0) { yaw = 1.5 * Math.PI; } else { yaw = 0.5 * Math.PI; }
        yaw = yaw - Math.atan(d.z / d.x);
    } else if (d.z < 0) { yaw = Math.PI; }
    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2));
    pitch = -Math.atan(d.y / d.xz);
    yaw = -yaw * 180 / Math.PI;
    pitch = pitch * 180 / Math.PI;
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch) || yaw == null || pitch == null || yaw == undefined || pitch == null) return;

    return [yaw, pitch]

}

let delay
let doneCoords = new Set()

const commandTrigger = register("command", () => {
    if (config.auto4) {
        chat("&c Disabling Auto 4");
        config.auto4 = false;
    } else {
        chat("&a Enabling Auto 4");
        doneCoords.clear()
        config.auto4 = true;
    }
}).setName("/auto4").unregister()


const isNearPlate = () => Player.getY() == 127 && Player.getX() >= 62 && Player.getX() <= 65 && Player.getZ() >= 34 && Player.getZ() <= 37;

const getBowShootSpeed = () => {
    const bow = Player.getInventory().getItems().slice(0, 9).find(a => a?.getID() === 261);
    if (!bow) return null;

    const lore = bow.getLore();

    let shotSpeed = 300;

    for (let line of lore) {
        const match = line.removeFormatting().match(/^Shot Cooldown: (\d+(?:\.\d+)?)s$/);
        if (match) {
            shotSpeed = parseFloat(match[1]) * 1000;
            break;
        }
    }

    return shotSpeed;
}


const trigger = register("tick", () => {
    if (!config.auto4) return;
    if (Player.getHeldItem()?.getID() !== 261) return;
    if (Date.now() - lastShot < getBowShootSpeed()) return;
    if (!isNearPlate()) {
        doneCoords.clear()
        return;
    }

    const possible = DevBlocks.filter(coord => !doneCoords.has(coord));
    if (!possible.length) return;

    const emeraldLocation = possible.find(({ x, y, z }) => World.getBlockAt(x, y, z).type.getID() === 133);
    let xdiff = 0.5;

    if (!emeraldLocation) return;

    doneCoords.add(emeraldLocation);

    if (emeraldLocation.x === 68 || emeraldLocation.x === 66) {
        xdiff = -0.6;
    } else if (emeraldLocation.x === 64) {
        xdiff = 1.3;
    }

    const item = Player.getHeldItem();
    const itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
    if (itemId !== "TERMINATOR") xdiff = 0.5;

    let [yaw, pitch] = calcYawPitch({ x: emeraldLocation.x + xdiff, y: emeraldLocation.y + 1.1, z: emeraldLocation.z });
    snapTo(yaw, pitch);

    Client.scheduleTask(0, () => {
        rightClick();
    });

    lastShot = Date.now();
}).unregister();


register("worldUnload", () => {
    doneCoords.clear()
})

export function toggle() {
    if (config.autoFourToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Auto Four &amodule.")
        openMenuTrigger.register()
        if (config.autoLeapi4) trigger.register()
        if (config.autoLeapWitherDoor) commandTrigger.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Auto Four &cmodule.")
    openMenuTrigger.unregister()
    if (config.autoLeapi4) trigger.unregister()
    if (config.autoLeapWitherDoor) commandTrigger.unregister()
    return
}
export default { toggle };