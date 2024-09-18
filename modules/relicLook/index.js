import config from "../../config";
import { calcYawPitch, chat, getClasses, rightClick, setBlockAt, snapTo } from "../../utils/utils";

let mc = Client.getMinecraft()
let keyW = new KeyBind(mc.field_71474_y.field_74351_w)
let keyD = new KeyBind(mc.field_71474_y.field_74366_z)
let keyA = new KeyBind(mc.field_71474_y.field_74370_x)

let pickedColor

register("command", (name) => {
    pickedColor = name
    handleUnsprint.register()
}).setName("relictest")

register("chat", () => {
    if (!config().relicToggle || !config().toggle || !config().cheatToggle) return
    pickupTrigger.register();
    if (config().relicLook) handleUnsprint.register()
}).setCriteria("[BOSS] Necron: All this, for nothing...")


const pickupTrigger = register("packetSent", (packet) => {
    try {
        const helmetName = ChatLib.removeFormatting(new Item(packet.func_149564_a(World.getWorld()).func_82169_q(3)).getName())
        if (!helmetName.includes("Relic")) return

        pickupTrigger.unregister()

        if (helmetName === "Corrupted Orange Relic") {
            if (!config().relicLook) return // TODO: Add relicLook to config
            if (!config().strafeMode) {
                const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
                if (!config().smoothLookRelics) {
                    keyW.setState(true);
                    snapTo(yaw, pitch);

                    handleUnsprint.register();
                } else {
                    smoothLook(yaw, pitch, 10, () => {
                        keyW.setState(true);

                        handleUnsprint.register()
                    })
                }
            } else {
                const [yaw, pitch] = [65.267471, 0]
                if (!config().smoothLookRelics) {
                    keyW.setState(true);
                    keyD.setState(true);
                    snapTo(yaw, pitch);

                    handleUnsprint.register()
                } else {
                    smoothLook(yaw, pitch, 10, () => {
                        keyW.setState(true);
                        keyD.setState(true);

                        handleUnsprint.register()
                    })
                }
            }
        } else if (helmetName === "Corrupted Red Relic") {
            if (!config().relicLook) return // TODO: Add relicLook to config
            if (!config().strafeMode) {
                const [yaw, pitch] = calcYawPitch({ x: 51, y: 7.5, z: 42 })
                if (!config().smoothLookRelics) {
                    keyW.setState(true);
                    snapTo(yaw, pitch);

                    handleUnsprint.register()
                } else {
                    smoothLook(yaw, pitch, 10, () => {
                        keyW.setState(true);

                        handleUnsprint.register()
                    })
                }
            } else {
                const [yaw, pitch] = [-74, 0]
                if (!config().smoothLookRelics) {
                    keyW.setState(true);
                    keyA.setState(true);
                    snapTo(yaw, pitch);

                    handleUnsprint.register()
                } else {
                    smoothLook(yaw, pitch, 10, () => {
                        keyW.setState(true);
                        keyA.setState(true);

                        handleUnsprint.register()
                    })
                }
            }
        }
    } catch (error) { return }
})

const handleUnsprint = register("tick", () => {
    if (pickedColor == "Orange" && Player.getZ() < 45) {
        if (!config().smoothLookRelics) {
            const [yaw, pitch] = [110.267471, 0]
            snapTo(yaw, pitch)
            keyW.setState(true)
            if (config().strafeMode) {
                keyD.setState(false)
                setTimeout(() => { 
                    keyW.setState(false);
                    handleUnsprint.unregister();
                 }, 150);
            } else {
                setTimeout(() => { 
                    keyW.setState(false)
                    handleUnsprint.unregister();
                }, 150);
            }
        } else {
            smoothLook(110.267471, 0, 5, () => {
                keyW.setState(true)
                if (config().strafeMode) {
                    keyD.setState(false)
                    setTimeout(() => { 
                        keyW.setState(false)
                        handleUnsprint.unregister();
                    }, 150);
                } else {
                    setTimeout(() => { 
                        keyW.setState(false)
                        handleUnsprint.unregister();
                    }, 150);
                }
            })
        }
    } else if (pickedColor == "Red" && Player.getZ() < 45.35) {
        if (!config().smoothLookRelics) {
            const [yaw, pitch] = [-119, -7.5]
            snapTo(yaw, pitch)
            keyW.setState(true)
            if (config().strafeMode) {
                keyA.setState(false)
                setTimeout(() => { 
                    keyW.setState(false)
                    handleUnsprint.unregister();
                }, 150);
            } else {
                setTimeout(() => { 
                    keyW.setState(false)
                    handleUnsprint.unregister();
                }, 150);
            }
        } else {
            smoothLook(-119, -7.5, 5, () => {
                keyW.setState(true)
                if (config().strafeMode) {
                    keyA.setState(false)
                    setTimeout(() => { 
                        keyW.setState(false)
                        handleUnsprint.unregister();
                    }, 150);
                } else {
                    setTimeout(() => { 
                        keyW.setState(false)
                        handleUnsprint.unregister();
                    }, 150);
                }
            })
        }
    } else if (pickedColor == "Blue" && Player.getZ() < 45) {
        const [yaw, pitch] = [95, 0]
        if (!config().setRelicPitchYaw) { [yaw, pitch] = calcYawPitch({x: 59, y: 8, z: 44}) }
        if (!config().smoothLookRelics) {
            keyW.setState(false)
            Player.setHeldItemIndex(8)
            snapTo(yaw, pitch);
            
            handleUnsprint.unregister();
        } else {
            keyW.setState(false)
            Player.setHeldItemIndex(8)
            smoothLook(yaw, pitch, 5, () => {
                handleUnsprint.unregister();
            })
        }
    } else if (pickedColor == "Green" && Player.getZ() < 45.35) {
        const [yaw, pitch] = [-100, -20]
        if (!config().setRelicPitchYaw) { [yaw, pitch] = calcYawPitch({x: 49, y: 7, z: 44}) }
        if (!config().smoothLookRelics) {
            keyW.setState(false)
            Player.setHeldItemIndex(8)
            snapTo(yaw, pitch);
            
            handleUnsprint.unregister();
        } else {
            keyW.setState(false)
            Player.setHeldItemIndex(8)
            smoothLook(yaw, pitch, 5, () => {
                handleUnsprint.unregister();
            })
        }
    } else if (pickedColor == "Purple" && Player.getZ() < 45) { // Fix 44, Soon TM
        setBlockAt(49, 7, 44, 0);
        setBlockAt(51, 7, 42, 0);
        setBlockAt(57, 7, 42, 0);
        setBlockAt(59, 7, 44, 0);

        const [yaw, pitch] = calcYawPitch({x: 54, y: 7, z: 41})
        if (!config().smoothLookRelics) {
            Player.setHeldItemIndex(8)
            snapTo(yaw, pitch);

            handleUnsprint.unregister();
        } else {
            Player.setHeldItemIndex(8);
            smoothLook(yaw, pitch, 5, () => {
                handleUnsprint.unregister();
            })
        }
    }
}).unregister()

const cauldrons = {
    "Green": { x: 49, y: 7, z: 44 },
    "Red": { x: 51, y: 7, z: 42 },
    "Purple": { x: 54, y: 7, z: 41 },
    "Orange": { x: 57, y: 7, z: 42 },
    "Blue": { x: 59, y: 7, z: 44 }
}

const triggerbot = register("RenderWorld", () => {
    const block = Player.lookingAt()
    const blockID = block?.getType()?.getID()
    if (blockID !== 118 && blockID !== 145) return

    const cauldronCoords = cauldrons[pickedColor]
    if (cauldronCoords["x"] !== block.getX() || cauldronCoords["z"] !== block.getZ() || cauldronCoords["y"] !== block.getY() && cauldronCoords["y"] - 1 !== block.getY()) return // yeah
    rightClick()
    triggerbot.unregister()
}).unregister()

register("chat", (name, relicColor) => {
    if (!config().relicTriggerbot || name !== Player.getName() || !config().relicToggle) return
    pickedColor = relicColor
    triggerbot.register()
}).setCriteria(/^(\w{3,16}) picked the Corrupted (\w{3,6}) Relic!$/) // I like regex

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
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Relic &cmodule.")
    return
}
export default { toggle };