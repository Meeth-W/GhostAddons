import Dungeon from "../../BloomCore/dungeons/Dungeon"
import { getSkyblockItemID } from "../../BloomCore/utils/Utils"
import config from "../config"

export const prefix = "§8[&6Ghost&8]§r "
const defaultColor = "§7"

export function chat(message, id = null, hoverElement) {
    if (!id) return new Message(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor)).chat()
    return new Message(message).setChatLineId(id).chat()
}

export function mod_chat(message) {
    return ChatLib.chat(prefix + `&9Config Update&f: &7` + message.toString())
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

export function getPreset() {
    if (!config().slotBindingautoSelect) return config().slotBindingPreset
    if (!isInDungeon()) return config().slotBindingPreset

    let selectedClass = getClass()
    if (selectedClass == "Mage") return 0
    else if (selectedClass == "Archer") return 1
    else if (selectedClass == "Berserk") return 2
    else if (selectedClass == "Healer") return 3
    else if (selectedClass == "Tank") return 4
    else return config().slotBindingPreset
}

export function getDynamicColor() {
    if (!config().slotBindingdynamicColoring) return config().slotBindingdefaultColor.getRGB()

    let preset = getPreset()
    if (preset == 0) return Renderer.AQUA
    else if (preset == 1) return Renderer.GOLD
    else if (preset == 2) return Renderer.RED
    else if (preset == 3) return Renderer.LIGHT_PURPLE
    else if (preset == 4) return Renderer.DARK_GREEN
    else return config().slotBindingdefaultColor.getRGB()
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

export function rotate(yaw, pitch) {
    const player = Player.getPlayer();
    player.field_70177_z = yaw;
    player.field_70125_A = pitch;
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