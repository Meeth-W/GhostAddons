import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";
import { chat, getBlockFloor, getBlockPosFloor, isWithinTolerence, setBlockAt, snapTo } from "../../utils/utils";

const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
const C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

let inDoor = false;
const validBlocks = [173, 159];

const trigger = register("packetSent", (packet, event) => {
	if (!Dungeon.inDungeon) return;
	if (inDoor) return;
	const item = Player.getHeldItem();
	if (item?.getID() !== 368) return;
	const moving = packet.func_149466_j();
	const rotating = packet.func_149463_k();
	const onGround = packet.func_149465_i();
	if (!moving) return;
	const [x, y, z] = [packet.func_149464_c(), packet.func_149467_d(), packet.func_149472_e()];
	if (x > 0 || z > 0 || x < -200 || z < -200) return;
	const [xDec, zDec] = [(x + 200) % 1, (z + 200) % 1];
	let yaw = -1;
	let pitch = -1;
	let xOffset = 0;
	let zOffset = 0;
	if (isWithinTolerence(zDec, 0.7) && xDec > 0.3 && xDec < 0.7 && (validBlocks.includes(getBlockFloor(x + 1, y, z + 2).type.getID()) || validBlocks.includes(getBlockFloor(x - 1, y, z + 2).type.getID()))) {
		yaw = 0;
		pitch = 77;
		++zOffset;
	} else if (isWithinTolerence(xDec, 0.3) && zDec > 0.3 && zDec < 0.7 && (validBlocks.includes(getBlockFloor(x - 2, y, z + 1).type.getID()) || validBlocks.includes(getBlockFloor(x - 2, y, z - 1).type.getID()))) {
		yaw = 90;
		pitch = 77;
		--xOffset;
	} else if (isWithinTolerence(zDec, 0.3) && xDec > 0.3 && xDec < 0.7 && (validBlocks.includes(getBlockFloor(x - 1, y, z - 2).type.getID()) || validBlocks.includes(getBlockFloor(x + 1, y, z - 2).type.getID()))) {
		yaw = 180;
		pitch = 77;
		--zOffset;
	} else if (isWithinTolerence(xDec, 0.7) && zDec > 0.3 && zDec < 0.7 && (validBlocks.includes(getBlockFloor(x + 2, y, z - 1).type.getID()) || validBlocks.includes(getBlockFloor(x + 2, y, z + 1).type.getID()))) {
		yaw = 270;
		pitch = 77;
		++xOffset;
	} else if (isWithinTolerence(zDec, 0.95) && xDec > 0.3 && xDec < 0.7 && (validBlocks.includes(getBlockFloor(x + 1, y, z + 2).type.getID()) || validBlocks.includes(getBlockFloor(x - 1, y, z + 2).type.getID()))) {
		yaw = 0;
		pitch = 84;
		++zOffset;
	} else if (isWithinTolerence(xDec, 0.05) && zDec > 0.3 && zDec < 0.7 && (validBlocks.includes(getBlockFloor(x - 2, y, z + 1).type.getID()) || validBlocks.includes(getBlockFloor(x - 2, y, z - 1).type.getID()))) {
		yaw = 90;
		pitch = 84;
		--xOffset;
	} else if (isWithinTolerence(zDec, 0.05) && xDec > 0.3 && xDec < 0.7 && (validBlocks.includes(getBlockFloor(x - 1, y, z - 2).type.getID()) || validBlocks.includes(getBlockFloor(x + 1, y, z - 2).type.getID()))) {
		yaw = 180;
		pitch = 84;
		--zOffset;
	} else if (isWithinTolerence(xDec, 0.95) && zDec > 0.3 && zDec < 0.7 && (validBlocks.includes(getBlockFloor(x + 2, y, z - 1).type.getID()) || validBlocks.includes(getBlockFloor(x + 2, y, z + 1).type.getID()))) {
		yaw = 270;
		pitch = 84;
		++xOffset;
	}
	if (yaw < 0 || pitch < 0) return;
	const tileEntity = World.getWorld().func_175625_s(getBlockPosFloor(x + xOffset, y + 1, z + zOffset).toMCBlock());
    if (!tileEntity || !tileEntity.func_152108_a()) return;
    const skullId = tileEntity.func_152108_a().getProperties().get("textures")[0].getValue();
	if (!["eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2JjYmJmOTRkNjAzNzQzYTFlNzE0NzAyNmUxYzEyNDBiZDk4ZmU4N2NjNGVmMDRkY2FiNTFhMzFjMzA5MTRmZCJ9fX0=", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWQ5ZDgwYjc5NDQyY2YxYTNhZmVhYTIzN2JkNmFkYWFhY2FiMGMyODgzMGZiMzZiNTcwNGNmNGQ5ZjU5MzdjNCJ9fX0="].includes(skullId)) return;
	inDoor = true;
	const [initialYaw, initialPitch] = [Player.getYaw(), Player.getPitch()];
	chat(`Door Skipping`);
	Client.sendPacket(new C03PacketPlayer.C06PacketPlayerPosLook(x, y, z, yaw, pitch, onGround));
	Client.sendPacket(new C08PacketPlayerBlockPlacement(item.itemStack));
	const trigger2 = register("packetReceived", packet => {
		Client.scheduleTask(0, () => snapTo(initialYaw, initialPitch));
		const [x, y, z] = [packet.func_148932_c(), packet.func_148928_d(), packet.func_148933_e()];
		setBlockAt(x + xOffset, y, z + zOffset, 0);
		setBlockAt(x + xOffset, y + 1, z + zOffset, 0);
		setBlockAt(x + xOffset * 2, y, z + zOffset * 2, 0);
		setBlockAt(x + xOffset * 2, y + 1, z + zOffset * 2, 0);
		setBlockAt(x + xOffset * 3, y, z + zOffset * 3, 0);
		setBlockAt(x + xOffset * 3, y + 1, z + zOffset * 3, 0);
		setBlockAt(x + xOffset * 4, y, z + zOffset * 4, 0);
		setBlockAt(x + xOffset * 4, y + 1, z + zOffset * 4, 0);
		setBlockAt(x + xOffset * 2 + (zOffset ? 1 : 0), y, z + zOffset * 2 + (xOffset ? 1 : 0), 20);
		setBlockAt(x + xOffset * 2 + (zOffset ? 1 : 0), y + 1, z + zOffset * 2 + (xOffset ? 1 : 0), 20);
		setBlockAt(x + xOffset * 2 - (zOffset ? 1 : 0), y, z + zOffset * 2 - (xOffset ? 1 : 0), 20);
		setBlockAt(x + xOffset * 2 - (zOffset ? 1 : 0), y + 1, z + zOffset * 2 - (xOffset ? 1 : 0), 20);
		inDoor = false;
		trigger2.unregister();
	}).setFilteredClass(S08PacketPlayerPosLook);
	cancel(event);
}).setFilteredClass(C03PacketPlayer).unregister();

export function toggle() {
    if (config().doorSkipToggle && config().toggle && config().cheatToggle) {
        if (config().debug) chat("&aStarting the &6Door Skip &amodule.")
        trigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Door Skip &cmodule.")
    trigger.unregister()
    return
}
export default { toggle };