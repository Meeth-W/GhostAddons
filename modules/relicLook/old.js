import config from "../../config";
import { calcYawPitch, chat, snapTo } from "../../utils/utils";

let rotated = [false, ""];
let mc = Client.getMinecraft()
let keyW = new KeyBind(mc.field_71474_y.field_74351_w)
let keyD = new KeyBind(mc.field_71474_y.field_74366_z)
let keyA = new KeyBind(mc.field_71474_y.field_74370_x)

const trigger = register("chat", (message) => {
    if (ChatLib.removeFormatting(ChatLib.getChatMessage(message)).includes("Orange")) {
        const regex = /\b(\w+) picked the Corrupted Orange Relic!/;

        let match =  ChatLib.removeFormatting(ChatLib.getChatMessage(message)).match(regex)
        if (match[1] !== Player.getName()) return;
        chat("&aRotating towards &6Orange")
        if (config().relicSmoothRotate) {
            smoothLook(65.267471, 0, 10, () => {
                rotated = [true, 1];
                chat("&aStrafing towards &6Orange")
                keyD.setState(true)
                keyW.setState(true)
            });
        } else {
            snapTo(65.267471, 0);
            rotated = [true, 1];
            chat("&aStrafing towards &6Orange")
            keyD.setState(true)
            keyW.setState(true)
        }
    }
    if (ChatLib.removeFormatting(ChatLib.getChatMessage(message)).includes("Red")) {
        const regex = /(\w+) picked the Corrupted Red Relic!/;
    
        let match =  ChatLib.removeFormatting(ChatLib.getChatMessage(message)).match(regex)
        if (match[1] !== Player.getName()) return;
        chat("&aRotating towards &cRed")
        if (config().relicSmoothRotate) {
            smoothLook(-74, 0, 10, () => {
                rotated = [true, 2];
                chat("&aStrafing towards &cRed")
                keyA.setState(true)
                keyW.setState(true)
            });
        } else {
            snapTo(-74, 0);
            rotated = [true, 2];
            chat("&aStrafing towards &cRed")
            keyA.setState(true)
            keyW.setState(true)
        }
    }
}).setCriteria("picked the Corrupted").setContains().unregister();

const cancelSprint = register("tick", () => {
    if (rotated[0] && Player.getZ() < 45 && rotated[1] == 1) { // Orange
        if (config().relicSmoothRotate) {
            chat("&aRotating towards &6Orange Cauldron")
            smoothLook(110.267471, 0, 5, () => {
                keyD.setState(false)
                keyW.setState(true)
                setTimeout(() => { keyW.setState(false) }, 150);
                rotated = [false, 0]
            })
        } else {
            chat("&aRotating towards &6Orange Cauldron")
            snapTo(110.267471, 0)
            keyD.setState(false)
            keyW.setState(true)
            setTimeout(() => { keyW.setState(false) }, 150);
            rotated = [false, 0]
        }
        return
    } else if (rotated[0] && Player.getZ() < 45.35 && rotated[1] == 2) { // Red
        if (config().relicSmoothRotate) {
            chat("&aRotating towards &cRed Cauldron")
            smoothLook(-119, -7.5, 5, () => {
                keyA.setState(false)
                keyW.setState(true)
                setTimeout(() => { keyW.setState(false) }, 150);
                rotated = [false, 0]
            })
            return 
        } else {
            chat("&aRotating towards &cRed Cauldron")
            snapTo(-119, -7.5)
            keyA.setState(false)
            keyW.setState(true)
            setTimeout(() => { keyW.setState(false) }, 150);
            rotated = [false, 0]
            return 
        }
    }
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

export function toggle() {
    if (config().relicToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Relic &amodule.")
        trigger.register()
        cancelSprint.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Relic &cmodule.")
    trigger.unregister()
    cancelSprint.register()
    return
}
export default { toggle };