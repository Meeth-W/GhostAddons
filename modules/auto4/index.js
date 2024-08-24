import config from '../../config'
import { chat } from '../../utils/utils';

// Credits: Miles (hbmiles)
export const mc = Client.getMinecraft()

export const rightClick = () => {
    const rightClickMethod = mc.getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(mc, null);
}

export const swapItem = (itemName) => {
    const index = Player.getInventory().getItems().slice(0, 9).findIndex(a => a?.getName()?.toLowerCase()?.includes(itemName.toLowerCase()))
    if (index == -1) return false

    const initialIndex = Player.getHeldItemIndex()
    const shouldSwap = initialIndex !== index
    if (shouldSwap) Player.setHeldItemIndex(index)
    return (shouldSwap)
}

let bossFightActive = false;

register('chat', () => {
    bossFightActive = true
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register('chat', () => {
    bossFightActive = false
}).setCriteria("[BOSS] Goldor: Closer to me!")

const handleRod = register("chat", () => {
    if (!bossFightActive) return;
    let currItem = Player.getHeldItemIndex()
    chat('Swapping to &6Phoenix.')
    swapItem('Rod');
    setTimeout(() => {
        rightClick()
        setTimeout(() => {
            Player.setHeldItemIndex(currItem)
        }, 100);
    }, 100); 
}).setChatCriteria(/^Your (?:⚚ )?Bonzo's Mask saved your life!$/).unregister();


// Helper Functions and Constants
const emeraldCoords = new Set([
    [[68, 126, 50], [67, 126, 50]],
    [[66, 126, 50], [67, 126, 50]],
    [[64, 126, 50], [65, 126, 50]],
    [[68, 128, 50], [67, 128, 50]],
    [[66, 128, 50], [67, 128, 50]],
    [[64, 128, 50], [65, 128, 50]],
    [[68, 130, 50], [67, 130, 50]],
    [[66, 130, 50], [67, 130, 50]],
    [[64, 130, 50], [65, 130, 50]]
]);

const shootCoords = new Set([
    [67, 126, 50],
    [67, 128, 50],
    [67, 130, 50],
    [65, 126, 50],
    [65, 128, 50],
    [65, 130, 50]
]);

let lastShot;
let delay;
let FourthDevEnabled = false;
let doneCoords = new Set();

// Functions

export function getEyePos() {
    return {
        x: Player.getX(),
        y: Player.getY() + Player.getPlayer().func_70047_e(),
        z: Player.getZ()
    };
}

function normalizeYaw(yaw) {
    yaw = yaw % 360;
    if (yaw > 180) {
        yaw -= 360;
    } else if (yaw < -180) {
        yaw += 360;
    }
    return yaw;
}
let lastShotAt = [0, 0, 0]

export const smoothLook = ([x1, y1, z1], [x2, y2, z2], yawoffset, bonusSteps, done) => {
    const totalSteps = 0 + bonusSteps; // Reduced steps for faster head rotation
    let currentStep = 0;

    let targetYaw = normalizeYaw(calculateAngle(x1, z1, x2, z2)) + yawoffset;
    let targetPitch = calculatePitch([x1, y1, z1], [x2, y2, z2]);

    if (targetPitch > 90) {
        targetPitch = 90;
    }
    if (targetPitch < -90) {
        targetPitch = -90;
    }

    const smoothLook_ = register('step', () => {
        const curYaw = normalizeYaw(Player.getYaw());
        const curPitch = Player.getPitch();

        const yawDifference = normalizeYaw(targetYaw - curYaw);
        const pitchDifference = targetPitch - curPitch;

        const yawStep = yawDifference / totalSteps;
        const pitchStep = pitchDifference / totalSteps;

        if (currentStep < totalSteps) {
            setYaw(normalizeYaw(curYaw + yawStep));
            setPitch(curPitch + pitchStep);
            currentStep++;
        } else {
            setYaw(targetYaw);
            setPitch(targetPitch);
            if ((x2) != (lastShot[0])) {
                if (done) Client.scheduleTask(1, done);
                lastShotAt = [x2, y2, z2]
            } 
            smoothLook_.unregister();
        }
    });
};

export const setYaw = (yaw) => Player.getPlayer().field_70177_z = yaw;
export const setPitch = (pitch) => Player.getPlayer().field_70125_A = pitch;

export function calculatePitch(playerCoords, targetCoords) {
    const playerEyesCoords = [playerCoords[0], playerCoords[1] + 1, playerCoords[2]];
    const vectorX = targetCoords[0] - playerEyesCoords[0];
    const vectorY = targetCoords[1] - playerEyesCoords[1];
    const vectorZ = targetCoords[2] - playerEyesCoords[2];

    const distanceXZ = Math.sqrt(vectorX * vectorX + vectorZ * vectorZ);
    const distanceY = vectorY;

    const pitchRadians = Math.atan2(distanceY, distanceXZ);
    const pitchDegrees = pitchRadians * (180 / Math.PI);

    return pitchDegrees * -1;
}

export function calculateAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < -180) {
        angle += 360;
    } else if (angle > 180) {
        angle -= 360;
    }

    return angle - 90;
}

export const randomNumber = (x, y) => Math.floor(Math.random() * (y - x + 1)) + x;

// Other Functions

const isNearPlate = () => Player.getY() === 127 && Player.getX() >= 62 && Player.getX() <= 65 && Player.getZ() >= 34 && Player.getZ() <= 37;

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
};


// Main Functionality
let pre4 = false
const handlei4 = register("tick", () => {
    if (!config().pre4Toggle) return;
    if (pre4)return;
    if (Player.getHeldItem()?.getID() !== 261) return;
    if (Date.now() - lastShot < getBowShootSpeed()) return;
    if (!isNearPlate()) {
        doneCoords.clear();
        return;
    }

    const possible = Array.from(shootCoords).filter(coord => !doneCoords.has(coord.join(',')));
    if (!possible.length) return;

    const emeraldLocation = Array.from(emeraldCoords).find(coord => {
        const [x, y, z] = coord[0];
        return World.getBlockAt(x, y, z).type.getID() === 133;
    });

    if (!emeraldLocation) return;

    doneCoords.add(emeraldLocation.join(','));

    const targetPos = { x: emeraldLocation[1][0]+0.5, y: emeraldLocation[1][1], z: emeraldLocation[1][2] };
    const playerPos = getEyePos();
    pre4=true
    lastShotAt = [targetPos.x, targetPos.y+2, targetPos.z]
    smoothLook(
        [playerPos.x, playerPos.y, playerPos.z],
        [targetPos.x, targetPos.y+2, targetPos.z],
        0, 
        config().smoothLookSteps, 
        () => {
            rightClick();
            pre4=false
        }
    );

    lastShot = Date.now();
}).unregister();

register("worldUnload", () => {
    doneCoords.clear();
});

const commandTrigger = register("command", () => {
    if (config().pre4Toggle) {
        chat("&c Disabling Auto 4");
        config().pre4Toggle = false;
    } else {
        chat("&a Enabling Auto 4");
        doneCoords.clear()
        config().pre4Toggle = true;
    }
}).setName("/auto4").unregister()

export function toggle() {
    if (config().pre4Toggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Four &amodule.")
        handlei4.register()
        commandTrigger.register()
        handleRod.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Four &cmodule.")
    handlei4.unregister()
    commandTrigger.unregister()
    handleRod.unregister()
    return
}
export default { toggle };