import RenderLib from "../../../RenderLib";
import { getClass } from "../../utils/utils";
const dragLocations = {
    purple: {x: 56, y: 7, z: 126},
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
    green: {x: 55, y: 6, z: 108},
    blue: {x: 47, y: 6, z: 110},
    wait: {x: 38, y: 6, z: 104}
}

const colors = {
    purple: {r: 128, g: 0, b: 128},
    red: {r: 255, g: 0, b: 0},
    orange: {r: 255, g: 165, b: 0},
    green: {r: 0, g: 128, b: 0},
    blue: {r: 0, g: 0, b: 255},
    wait: {r: 1, g: 1, b: 1}
}

export const renderWaypoints = register('renderOverlay', () => {
    let locations = stackLocations;
    if (getClass() == 'Mage' || getClass() == 'Healer' || getClass() == 'Tank') locations = dragLocations;

    Object.keys(locations).forEach(key => {
        const location = locations[key];
        const [r, g, b] = colors[key]
        RenderLib.drawCyl(location.x, location.y, location.z, 1.5, 1.5, 0.1, 30, 1, 0, 90, 90, r/255, g/255, b/255, 1, true, false);
    });
}).unregister();