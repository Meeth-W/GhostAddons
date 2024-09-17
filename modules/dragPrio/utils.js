import config from "../../config"
import { calculateAngle, findClosestColor, getDistance, holdingXItem, randomize, snapTo, swapItem } from "../../utils/utils"

export const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")

let lastCharge = null
let charged = false
let waitAmount = 0

let dragDelays = {
    purple: 350,
    red: 440,
    orange: 440,
    green: 420,
    blue: 420,
    icespray: 100
}

export function pathFind(x, y, z, done) {
    if (Client.isInGui() || Client.isInChat()) return
    let jumping = false
    const pathfind = register('step', () => {
        if (Client.isInGui() || Client.isInChat()) {
            KeyBinding.func_74510_a(42, false)
            KeyBinding.func_74510_a(17, false)
            KeyBinding.func_74510_a(57, false)
            pathfind.unregister()
            return
        }
        if (getDistance(parseInt(Player.getX()), parseInt(Player.getZ()), x, z) < 1.5) {
            KeyBinding.func_74510_a(17, false);
            KeyBinding.func_74510_a(42, false);
            pathfind.unregister();

            if (done) return done();
        }
        if (getDistance(parseInt(Player.getX()), parseInt(Player.getZ()), x, z) < 4) KeyBinding.func_74510_a(42, true)
        
        const block = Player.lookingAt();
        if (block instanceof Block) {
            if (!jumping) {
                jumping = true;
                KeyBinding.func_74510_a(57, jumping);
            }
        } else {
            if (jumping) {
                jumping = false;
                KeyBinding.func_74510_a(57, jumping);
            } 
        }

        snapTo(calculateAngle(Player.getX(), Player.getZ(), x, z), 18)
    }).setFps(200)
}

export function doSpray() {
    KeyBinding.func_74510_a(57, true)
    KeyBinding.func_74510_a(-99, false)
    setTimeout(() => { swapItem("Ice Spray Wand") }, randomize(25, 5));
    setTimeout(() => {
        KeyBinding.func_74510_a(-99, true)
        KeyBinding.func_74510_a(57, false)
        setTimeout(() => {
            KeyBinding.func_74510_a(-99, false)
            swapItem('Soul Whip')
        }, randomize(100, 25));
    }, randomize(100, 25));
}

export const handleDebuff = register("tick", () => {
    if (!(holdingXItem('Last Breath')) || !(Player.getPitch() < -70)) {
        if (charged) {
            charged = false
            KeyBinding.func_74510_a(-99, charged)
        }
        return
    }
    if (
        new Date().getTime() - lastCharge < waitAmount || 
        !holdingXItem('Last Breath') || 
        !(Player.getPitch() < -70) || 
        !config().autoLB || 
        (Player.getY() > 31)
    ) return
    charged = !charged
    if (charged) {
        waitAmount = dragDelays[findClosestColor()]
    }
    else {waitAmount = 500}
    KeyBinding.func_74510_a(-99, charged)
    lastCharge = new Date().getTime()
}).unregister();

export const smoothLook = (targetYaw, targetPitch, bonusSteps, done) => {
    const totalSteps = 0 + bonusSteps; // Reduced steps for faster head rotation
    let currentStep = 0;

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
            snapTo(normalizeYaw(curYaw + yawStep), curPitch + pitchStep)
            currentStep++;
        } else {
            snapTo(targetYaw, targetPitch)
            if (done) done()
            smoothLook_.unregister();
        }
    });
};

function normalizeYaw(yaw) {
    yaw = yaw % 360;
    if (yaw > 180) {
        yaw -= 360;
    } else if (yaw < -180) {
        yaw += 360;
    }
    return yaw;
}

register("worldLoad", () => {
    handleDebuff.unregister();
})
