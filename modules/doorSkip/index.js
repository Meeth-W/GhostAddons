import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";
import { chat, getBlockFloor, rotate } from "../../utils/utils";

const Blocks = Java.type("net.minecraft.init.Blocks");
const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
const C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

let inDoor = false;

const trigger = register("tick", () => {
	if (!Dungeon.inDungeon) return;
	if (Player.getHeldItem()?.getID() !== 368 && !inDoor) return;
	const [x, y, z] = [Player.getX() + Player.getMotionX(), Player.getY(), Player.getZ() + Player.getMotionZ()];
	if (x > 0 || z > 0 || x < -200 || z < -200) return;
	const southBlock = getBlockFloor(x, y, z + 0.301); // yaw0
	const westBlock = getBlockFloor(x - 0.301, y, z); // yaw90
	const northBlock = getBlockFloor(x, y, z - 0.301); // yaw180
	const eastBlock = getBlockFloor(x + 0.301, y, z); // yaw270
	const southId = southBlock.type.getID();
	const westId = westBlock.type.getID();
	const northId = northBlock.type.getID();
	const eastId = eastBlock.type.getID();
	const southMeta = southBlock.getMetadata();
	const westMeta = westBlock.getMetadata();
	const northMeta = northBlock.getMetadata();
	const eastMeta = eastBlock.getMetadata();
	const southWither = southId === 173;
	const westWither = westId === 173;
	const northWither = northId === 173;
	const eastWither = eastId === 173;
	const southBlood = southId === 159 && southMeta === 14
	const westBlood = westId === 159 && westMeta === 14
	const northBlood = northId === 159 && northMeta === 14
	const eastBlood = eastId === 159 && eastMeta === 14
	if (!southWither && !westWither && !northWither && !eastWither && !southBlood && !westBlood && !northBlood && !eastBlood) {
		inDoor = false;
		Blocks.field_150402_ci.func_149676_a(0, 0, 0, 1, 1, 1);
		Blocks.field_150406_ce.func_149676_a(0, 0, 0, 1, 1, 1);
		return;
	}
	if (inDoor) return;
	inDoor = true;
	const trigger1 = register("packetSent", (packet, event) => {
		trigger1.unregister();
		const moving = packet.func_149466_j();
		const rotating = packet.func_149463_k();
		const onGround = packet.func_149465_i();
		const [x, y, z] = [packet.func_149464_c(), packet.func_149467_d(), packet.func_149472_e()];
		const yaw = (southWither || southBlood) ? 0 : (westWither || westBlood) ? 90 : (northWither || northBlood) ? 180 : 270;
		const pitch = 85;
		const [initialYaw, initialPitch] = [Player.getYaw(), Player.getPitch()];
		const item = Player.getHeldItem();
		if (!item) return;
		if (moving) Client.sendPacket(new C03PacketPlayer.C06PacketPlayerPosLook(x, y, z, yaw, pitch, onGround));
		else Client.sendPacket(new C03PacketPlayer.C05PacketPlayerLook(yaw, pitch, onGround));
		Client.sendPacket(new C08PacketPlayerBlockPlacement(item.itemStack));
		const trigger2 = register("packetReceived", () => {
			if (southWither || westWither || northWither || eastWither) Blocks.field_150402_ci.func_149676_a(-1, -1, -1, -1, -1, -1);
			else if (southBlood || westBlood || northBlood || eastBlood) Blocks.field_150406_ce.func_149676_a(-1, -1, -1, -1, -1, -1);
			Client.scheduleTask(0, () => rotate(initialYaw, initialPitch));
			chat(`Door Skipping.`)
			trigger2.unregister();
		}).setFilteredClass(S08PacketPlayerPosLook);
		cancel(event);
	}).setFilteredClass(C03PacketPlayer);
}).unregister();

export function toggle() {
    if (config.doorSkipToggle && config.toggle && config.cheatToggle) {
        if (config.debug) chat("&aStarting the &6Door Skip &amodule.")
        trigger.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Door Skip &cmodule.")
    trigger.unregister()
    return
}
export default { toggle };