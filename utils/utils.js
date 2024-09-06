import Dungeon from "../../BloomCore/dungeons/Dungeon"
import { getSkyblockItemID } from "../../BloomCore/utils/Utils"
import Promise from "../../PromiseV2";
import request from "../../requestV2"
import { data } from "./data"

const Color = Java.type("java.awt.Color");
const makeRequest = (address) => request({
    url: address,
    headers: {
        'User-Agent': ' Mozilla/5.0',
        'Content-Type': 'application/json'
    },
    json: true
})
const MCBlock = Java.type("net.minecraft.block.Block");
export const prefix = "§8[&6Ghost&8]§r "
const defaultColor = "§7"

export function chat(message, id = null, hoverElement) {
    if (!id) return new Message(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor)).chat()
    return new Message(message).setChatLineId(id).chat()
}

export function mod_chat(message) {
    return ChatLib.chat(prefix + `&9Config Update&f: &7` + message.toString())
}

export function getColor(values) {
    return new Color(Renderer.color(values[0], values[1], values[2], values[3]))
}

export function isInBoss() { return Dungeon.bossEntry }

let inP3 = false;

register('packetReceived', (packet) => {
    if (packet.func_148916_d()) return
    const message = packet.func_148915_c().func_150254_d().removeFormatting()
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inP3 = true;
    }
    if (message == "The Core entrance is opening!")
        inP3 = false;
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S02PacketChat"))

export function isInP3() { return inP3 }

export function getDistance(x1, z1, x2, z2) {
    return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)
}
export const isBetween = (number, [a, b]) => number >= a && number <= b
export const getSbLevelPrefix = (number) => Object.keys(sbLevelsPrefix).filter(pref => isBetween(number, sbLevelsPrefix[pref]))
export const sbLevelsPrefix = {
    "&7": [1, 39],
    "&f": [40, 79],
    "&e": [80, 119],
    "&a": [120, 159],
    "&2": [160, 199],
    "&b": [200, 239],
    "&3": [240, 279],
    "&9": [280, 319],
    "&d": [320, 359],
    "&5": [360, 399],
    "&6": [400, 439],
    "&c": [440, 479]
}

export function getItemIndex(item) {
    let hotbar = Player.getInventory().getItems().slice(0, 8)
    for (i = 0; i < 8; i ++) {
        if (hotbar[i] && hotbar[i].getLore()[0].includes(item)) {
            return i
        }
    }
    chat(`${item} not in Hotbar!`)
    return Player.getHeldItemIndex()
}

export class queueChat {
    static queue = []
    static lastMessage = 0
    static timeout = 400

    static queueCommands(funcs) {
        this.queue = funcs
        this.doNext()
    }
    static doNext() {
        if (!this.queue.length) return
        if (Date.now() - this.lastMessage >= this.timeout) {
            this.lastMessage = Date.now()
            const func = this.queue.shift()
            if (func) func()
        }
        setTimeout(() => this.doNext(), this.timeout)
    }
}

export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { chat(`&cError: ${e.reason}`) }
}

export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export function getSlotCoords(i) {
    if (i >= Player.getContainer().getSize()) return [0, 0];

    const gui = Client.currentGui.get();
    const slot = gui.field_147002_h?.func_75139_a(i);
    const x = slot.field_75223_e + gui?.getGuiLeft() ?? 0;
    const y = slot.field_75221_f + gui?.getGuiTop() ?? 0;

    return [x, y];
}

export function leftClick() {
    const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null)
    leftClickMethod.setAccessible(true);
    leftClickMethod.invoke(Client.getMinecraft(), null)
}


export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
}

export const inRange = (arr) => {
    let x = Player.getX()
    let y = Player.getY()
    let z = Player.getZ()
    if (x > arr[1][0] && x <= arr[1][1]) {
        if (y > arr[2][0] && y <= arr[2][1]) {
            if (z > arr[3][0] && z <= arr[3][1]) {
                return true
            }
        }
    }
    return false
}

export function getBlockFloor(x, y, z) {
    return World.getBlockAt(Math.floor(x), Math.floor(y), Math.floor(z));
}

export function formatNum(num) {
    if (isNaN(num)) {
        return 'Invalid number';
    }

    const [integerPart, fractionalPart] = num.toString().split('.');
    const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart ? `${integerWithCommas}.${fractionalPart}` : integerWithCommas;
}

export function getEyePos() {
    return {
        x: Player.getX(),
        y: Player.getY() + Player.getPlayer().func_70047_e(),
        z: Player.getZ()
    };
}

export function snapTo(yaw, pitch) {
    const player = Player.getPlayer();

    player.field_70177_z = yaw
    player.field_70125_A = pitch;
}

export function calcYawPitch(blcPos, plrPos) {
    if (!plrPos) plrPos = getEyePos();
    let d = {
        x: blcPos.x - plrPos.x,
        y: blcPos.y - plrPos.y,
        z: blcPos.z - plrPos.z
    };
    let yaw = 0;
    let pitch = 0;
    if (d.x != 0) {
        if (d.x < 0) { yaw = 1.5 * Math.PI; } else { yaw = 0.5 * Math.PI; }
        yaw = yaw - Math.atan(d.z / d.x);
    } else if (d.z < 0) { yaw = Math.PI; }
    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2));
    pitch = -Math.atan(d.y / d.xz);
    yaw = -yaw * 180 / Math.PI;
    pitch = pitch * 180 / Math.PI;
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch) || yaw == null || pitch == null || yaw == undefined || pitch == null) return;

    return [yaw, pitch]

}

let canLook = true
let fromYaw
let fromPitch
let destYaw
let destPitch
let startTime
let time

const convertYawToInternal = (destinationYaw) => {
    let currentYaw = Player.getPlayer().field_70177_z
    let mcYaw = ((currentYaw + 180) % 360) - 180
    let deltaYaw = mcYaw - destinationYaw
    deltaYaw += (deltaYaw > 180) ? -360 : (deltaYaw < -180) ? 360 : 0
    return currentYaw - deltaYaw
}
const interpolate = (f, t, start, dur) => {
    let x = Date.now() - start
    let u = (f - t) / 2
    return u * Math.cos(((x * Math.PI) / dur)) - u + f
}
export const smoothLook = (dYaw, dPitch, dTime) => {
    if (!canLook) return
    time = dTime
    canLook = false
    shouldLook = true
    fromYaw = Player.getPlayer().field_70177_z
    fromPitch = Player.getPlayer().field_70125_A
    destYaw = dYaw
    destPitch = dPitch
    startTime = Date.now()
}

let shouldLook = false

register("renderWorld", () => {
    if (!shouldLook) return
    if (Date.now() <= (startTime + time)) {
        let newYaw = interpolate(fromYaw, convertYawToInternal(destYaw), startTime, time)
        let newPitch = interpolate(fromPitch, destPitch, startTime, time)
        Player.getPlayer().field_70177_z = newYaw
        Player.getPlayer().field_70125_A = newPitch
    } else {
        shouldLook = false
        canLook = true
        turning = false
    }
})

export function isInArray(input, array) {
    for (e in array) {
        if (array[e].toString() == input.toString()) return true
    }
    return false
}

export function getClasses() {
    const party = Dungeon.playerClasses;
    let classes = {"Mage": null, "Archer": null, "Tank": null, "Berserk": null, "Healer": null};
    for (let ign in party) { classes[party[ign].class] = ign; }
    return classes;
}

export const isHoldingLeapItem = () => {
    const held = Player.getHeldItem();
    const sbId = getSkyblockItemID(held);

    if (sbId !== "SPIRIT_LEAP" && sbId !== "INFINITE_SPIRIT_LEAP") return false;
    return true;
};

const blessings = {
    power: /Blessing of Power (.+)/,
    time: /Blessing of Time (.+)/,
}
const romanHash = {
    I: 1,
    V: 5,
    X: 10,
}
export function roundToHalf(number) {
    const rounded = Math.round(number * 2) / 2
    return Number.isInteger(rounded) ? Math.floor(rounded) : rounded
}

function romanToInt(s) {
    let accumulator = 0
    for (let i = 0; i < s.length; i++) {
        if (s[i] === 'I' && (s[i + 1] === 'V' || s[i + 1] === 'X')) {
            accumulator += romanHash[s[i + 1]] - romanHash[s[i]]
            i++
        } else {
            accumulator += romanHash[s[i]]
        }
    }
    return accumulator
}

export function getPower() {
    let footer = TabList?.getFooter()?.removeFormatting()
    return footer.match(blessings.power) ? romanToInt(footer.match(blessings.power)[1]) : 0
}

export function getTime() {
    let footer = TabList?.getFooter()?.removeFormatting()
    return footer.match(blessings.time) ? romanToInt(footer.match(blessings.time)[1]) : 0
}

export function getTruePower() { return getPower() + getTime() / 2 }

export const dragInfo = {
    POWER: { dragString: "§c§lRed", prio: [1, 3], spawned: false, easy: false, time: 2500 },
    FLAME: { dragString: "§6§lOrange", prio: [2, 1], spawned: false, easy: true, time: 3080 },
    ICE: { dragString: "§b§lBlue", prio: [3, 4], spawned: false, easy: false, time: 1920 },
    SOUL: { dragString: "§5§lPurple", prio: [4, 5], spawned: false, easy: true, time: 2000 },
    APEX: { dragString: "§a§lGreen", prio: [5, 2], spawned: false, easy: true, time: 2600 },
}

export function randomize(num, flux) {
    const randomizedNum = Math.round((Math.random() * 2 - 1) * flux * 100) / 100; // round to two decimal places
    return num + randomizedNum;
}

export function setBlockAt(x, y, z, id) {
	const world = World.getWorld();
	const blockPos = getBlockPosFloor(x, y, z).toMCBlock();
	world.func_175656_a(blockPos, MCBlock.func_176220_d(id));
	world.func_175689_h(blockPos);
}

export function isWithinTolerence(n1, n2) {
	return Math.abs(n1 - n2) < 1e-4;
}

export function getBlockPosFloor(x, y, z) {
	return new BlockPos(Math.floor(x), Math.floor(y), Math.floor(z));
}

export function addWhitelist(username) {
    chat(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id
        if (data.partyFinder.uuids.whitelist.includes(uuid)) {
            ChatLib.chat(`${prefix}&6${username} &cis already whitelisted.`)
        } else {
            data.partyFinder.uuids.whitelist.push(uuid);
            data.partyFinder.igns.whitelist.push(username)
            data.save()
            ChatLib.chat(`${prefix}&6${username} &aadded to the whitelist!`)
            return 0
        }
    }).catch(error => {
        ChatLib.chat(error)
    })
}

export function unWhitelist(username) {
    chat(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        const index = data.partyFinder.uuids.whitelist.indexOf(uuid)
        if (index !== -1) {
            data.partyFinder.uuids.whitelist.splice(index, 1)
            data.partyFinder.igns.whitelist.splice(index, 1)
            data.save()
            ChatLib.chat(`${prefix}&6${username} &aremoved from the whitelist!`)
            return 0
        } else {
            ChatLib.chat(`${prefix}&6${username} &cis not in the whitelist.`)
        }
    }).catch(error => {
        ChatLib.chat(error)
    })
}

export function addBlacklist(username) {
    chat(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        if (data.partyFinder.uuids.blacklist.includes(uuid)) {
            ChatLib.chat(`${prefix}&6${username} &cis already blacklisted.`)
        } else {
            data.partyFinder.uuids.blacklist.push(uuid);
            data.partyFinder.igns.blacklist.push(username)
            data.save()
            ChatLib.chat(`${prefix}&6${username} &aadded to the blacklist!`)
            return 0
        }
    }).catch(error => {
        ChatLib.chat(error)
    })
}
export function unBlacklist(username) {
    chat(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        const index = data.partyFinder.uuids.blacklist.indexOf(uuid)
        if (index !== -1) {
            data.partyFinder.uuids.blacklist.splice(index, 1)
            data.partyFinder.igns.blacklist.splice(index, 1)
            data.save()
            ChatLib.chat(`${prefix}&6${username} &aremoved from the blacklist!`)
            return 0
        } else {
            ChatLib.chat(`${prefix}&6${username} &cis not in the blacklist.`)
        }
    }).catch(error => {
        ChatLib.chat(error)
    })
}