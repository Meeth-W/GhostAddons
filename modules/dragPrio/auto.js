import RenderLib from "../../../RenderLib";
import config from "../../config";
import { chat, getClass, getDistance, randomize, snapTo } from "../../utils/utils";

let lastrotated = null;
// Soon TM
const dragLocations = {
    purple: {x: 56, y: 8, z: 126},
    red: {x: 28, y: 6, z: 56},
    orange: {x: 83, y: 6, z: 58},
    green: {x: 28, y: 6, z: 91},
    blue: {x: 83, y: 6, z: 97},
    wait: {x: 54.5, y: 5, z: 76.5}
}
const stackLocations = {
    purple: {x: 25, y: 6, z: 103},
    red: {x: 12, y: 7, z: 85},
    orange: {x: 55, y: 5, z: 87},
    green: {x: 50, y: 5, z: 76},
    blue: {x: 47, y: 6, z: 110},
    wait: {x: 38, y: 6, z: 104}
}
export const stackRotations = {
    purple: {yaw: -50, pitch: -24.5},
    red: {yaw: -148.5, pitch: -25},
    orange: {yaw: -133, pitch: -27},
    green: {yaw: 57, pitch: -32},
    blue: {yaw: -110, pitch: -26},
    wait: {yaw: -90, pitch: 90}
}
const colors = {
    purple: {r: 128, g: 0, b: 128},
    red: {r: 255, g: 0, b: 0},
    orange: {r: 255, g: 165, b: 0},
    green: {r: 0, g: 128, b: 0},
    blue: {r: 0, g: 0, b: 255},
    wait: {r: 255, g: 255, b: 255}
}

export const renderWaypoints = register('renderWorld', () => {
    let locations = stackLocations;
    if (getClass() == 'Mage' || getClass() == 'Healer' || getClass() == 'Tank') locations = dragLocations;

    Object.keys(locations).forEach(key => {
        const location = locations[key];
        const color = colors[key]
        RenderLib.drawCyl(location.x, location.y, location.z, 1.5, 1.5, 0.1, 30, 1, 0, 90, 90, color.r/255, color.g/255, color.b/255, 0.65, true, false);
    });
}).unregister();

export const handleSnaps = register('tick', () => {
    if (!config().snapWaypoints) return;
    if (getClass() == 'Mage' || getClass() == 'Healer' || getClass() == 'Tank') return
    if (new Date().getTime() - lastrotated < 1500) return;
    Object.keys(stackLocations).forEach(key => {
        if (key == 'wait') return;
        const location = stackLocations[key];
        if (getDistance(parseInt(Player.getX()), parseInt(Player.getZ()), location.x, location.z) < 1.5) {
            let rotation = stackRotations[key]
            snapTo(rotation.yaw, rotation.pitch)
            lastrotated = new Date().getTime()
            return
        }
    });
}).unregister();

export const handleRagAxe = register('chat', () => {
    if (!config().cheatToggle || !config().autoRagAxe) return
    if (!getClass() == "Archer" || !getClass() == "Berserk") return
    chat('Proccing Ragnarock Axe')
    swapItem('Ragnarock Axe');
    setTimeout(() => {
        rightClick();
        handleRagAxe.unregister();
    }, 150);
}).setCriteria(`[BOSS] Wither King: You... again?`).unregister();