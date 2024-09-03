import config from "../../config";
import { calcYawPitch, chat, getClasses, rightClick, snapTo } from "../../utils/utils";

let mc = Client.getMinecraft()
let keyW = new KeyBind(mc.field_71474_y.field_74351_w)
let keyD = new KeyBind(mc.field_71474_y.field_74366_z)
let keyA = new KeyBind(mc.field_71474_y.field_74370_x)

const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")

let p5Start
let spawnTime
let pickedAt
let pickedColor

register("chat", () => {
    if (!config().relicToggle || !config().toggle || !config().cheatToggle) return
    p5Start = Date.now()

    relicDetect.register();
    pickupTrigger.register();
    placeListener.register();
    if (config().relicLook) handleUnsprint.register()
}).setCriteria("[BOSS] Necron: All this, for nothing...")

const relicDetect = register("RenderWorld", () => {
    const existingRelics = World.getAllEntitiesOfType(ArmorStand).find(entity => new EntityLivingBase(entity.getEntity()).getItemInSlot(4)?.getName()?.removeFormatting()?.includes("Relic"))
    if (!existingRelics) return // If there are any armor stands wearing a relic head or whatever
    spawnTime = Date.now()
    chat("Relic spawned!")
    relicDetect.unregister()
}).unregister()

const pickupTrigger = register("packetSent", (packet) => {
    try {
        const helmetName = ChatLib.removeFormatting(new Item(packet.func_149564_a(World.getWorld()).func_82169_q(3)).getName())
        if (!helmetName.includes("Relic")) return

        pickupTrigger.unregister()
        pickedAt = Date.now()

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
        } else { // TODO: Add auto leap features
            if (!config().autoLeapRelics) return // TODO: Add relicLook to config
            openLeap();
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
        if (!config().smoothLookRelics) {
            snapTo(65, 0);
            
            handleUnsprint.unregister();
        } else {
            smoothLook(65, 0, 5, () => {
                handleUnsprint.unregister();
            })
        }
    } else if (pickedColor == "Green" && Player.getZ < 45.35) {
        if (!config().smoothLookRelics) {
            snapTo(-100, -20);

            handleUnsprint.unregister();
        } else {
            smoothLook(65, 0, 5, () => {
                handleUnsprint.unregister();
            })
        }
    }
}).unregister()

const placeListener = register('playerInteract', (action, pos) => {
    if (action.toString() != "RIGHT_CLICK_BLOCK") return
    const blockClicked = World.getBlockAt(pos.getX(), pos.getY(), pos.getZ()).type.getRegistryName()
    if (blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil' || !Player.getHeldItem()?.getName()?.includes("Relic")) return

    chat("Relic spawned in &6" + ((spawnTime - p5Start) / 1000) + "s.")
    chat("Relic placed in &6" + ((Date.now() - spawnTime) / 1000) + "s.")
    chat("Relic placed &6" + ((Date.now() - p5Start) / 1000) + "s &7into P5.")
    chat("Relic took &6" + ((pickedAt - spawnTime) / 1000) + "s &7to get picked up.")
    placeListener.unregister()
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
    if (!config().relicTriggerbot || name !== Player.getName()) return
    pickedColor = relicColor
    triggerbot.register()
}).setCriteria(/^(\w{3,16}) picked the Corrupted (\w{3,6}) Relic!$/) // I like regex


let waitingLeap = false
let item

const openLeap = () => {
    let leapSlot = parseInt(Player.getInventory().indexOf(Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting() == "Infinileap")?.getID()))
    if ( leapSlot > 7 || leapSlot < 0) return chat(`&4Leap Not Found in Hotbar`)
    let heldItem = Player.getHeldItemIndex();
    waitingLeap = true
    Client.scheduleTask(0, () => { Player.setHeldItemIndex(leapSlot)})
    Client.scheduleTask(1, () => {
        chat(`&cAttempting to Leap...`)
        rightClick()
    })
    Client.scheduleTask(3, () => { Player.setHeldItemIndex(heldItem) })
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const openMenuTrigger = register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    let classes = ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank'];
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        const items = Player.getContainer()?.getItems() 
        for (let i = 0; i < items.length; i++) {
            item = (items[i]?.getName())?.substring(2)?.toLowerCase()
            if (item == (getClasses()[classes[config().relicLeapTarget]])) {
                Player.getContainer().click(i)
            }
        }
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister()

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
        if (config().relicTriggerbot) triggerbot.register()
        if (config().autoLeapRelics) openMenuTrigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Relic &cmodule.")
    triggerbot.unregister()
    return
}
export default { toggle };