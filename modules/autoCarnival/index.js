import config from '../../config'
import { calcYawPitch, chat, rightClick, snapTo } from '../../utils/utils';

const EntityZombie = Java.type('net.minecraft.entity.monster.EntityZombie').class

let lampcoords = [
    [-96, 76, 31], [-99, 77, 32], [-102, 75, 32], [-106, 77, 31], [-109, 75, 30],[-112, 76, 28], [-115, 77, 25], [-117, 76, 22],[-118, 76, 19],[-119, 75, 15],[-119, 77, 12], [-118, 76, 9]
];
let smoothRotate = false
let delay = 200

function getTarget() {
    const Zombies = World.getAllEntitiesOfType(EntityZombie);
    if (!Zombies) return;

    let itemLists = {
        Diamond: [],
        Golden: [],
        Iron: [],
        Leather: []
    };

    Zombies.forEach(Zombie => {
        let currentZombie = new EntityLivingBase(Zombie.getEntity());
        let chestplate = currentZombie.getItemInSlot(3);
        if (!chestplate) return;
        let chestplatename = chestplate.getName();
        let targetcoord = { x: Zombie.getX() + Zombie.getMotionX() * 8, y: Zombie.getY() + Zombie.getEyeHeight(), z: Zombie.getZ() + Zombie.getMotionZ() * 8 };
        if (Player.asPlayerMP().distanceTo(Zombie.getX(), Zombie.getY(), Zombie.getZ()) > 40) return;
        for (let key in itemLists) {
            if (chestplatename.includes(key)) {
                itemLists[key].push(targetcoord);
                break;
            }
        }
    });

    let lamplist = [];

    lampcoords.forEach(coord => {
        let blockID = World.getBlockAt(...coord)?.type?.getID();
        if (blockID !== 124) return;
        lamplist.push({ x: coord[0] + 0.5, y: coord[1] + 0.6, z: coord[2] + 0.5 });
    });

    let targetlist = [
        ...itemLists.Diamond,
        ...lamplist,
        ...itemLists.Golden,
        ...itemLists.Iron,
        ...itemLists.Leather
    ];

    return targetlist;
}

let lastClick = 0

const handleCarnival = register("tick", () => {
    if (Date.now() - lastClick < delay) return;
    const playerHolding = Player.getHeldItem()
    if (!playerHolding?.getName()?.removeFormatting()?.includes("Dart")) return;
    const Target = getTarget()
    if (!Target) return;
    const currentTarget = Target.shift()
    if (!currentTarget) return;
    const [yaw, pitch] = calcYawPitch(currentTarget)
    if (!smoothRotate) {
        snapTo(yaw, pitch)
        Client.scheduleTask(0, () => {
        rightClick()
    })
    } else {
        smoothLook(yaw, pitch, 5, () => {
            Client.scheduleTask(0, () => {
                rightClick()
            })
        })
    }
})

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

register("command", (arg) => {
    if (arg) {
        if (isNaN(parseInt(arg))) { return chat('&cEnter a valid number!') }
        if (parseInt(arg) < 100) { return chat('&cDelay can not be under 100.') }
        delay = parseInt(arg);
        chat('&aDelay has been updated!')
    } else {
        if (smoothRotate) {
            chat("&c Disabling Smooth Auto Carnival");
            smoothRotate = false;
        } else {
            chat("&a Enabling Smooth Auto Carnival");
            smoothRotate = true;
        }
    }
}).setName("/autocarnival");

export function toggle() {
    if (config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Auto Carnival &amodule.")
        handleCarnival.register();
        return
    }
    if (config().debug) chat("&cStopping the &6Auto Carnival &cmodule.")
    handleCarnival.unregister();
    return
}
export default { toggle };