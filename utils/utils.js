import config from "../config"

export const prefix = "§8[&6Ghost&8]§r "
const defaultColor = "§7"

export function chat(message, id = null, hoverElement) {
    if (!id) return new Message(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor)).chat()
    return new Message(message).setChatLineId(id).chat()
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
    if (!config.slotBindingautoSelect) return config.slotBindingPreset
    if (!isInDungeon()) return config.slotBindingPreset

    let selectedClass = getClass()
    if (selectedClass == "Mage") return 0
    else if (selectedClass == "Archer") return 1
    else if (selectedClass == "Berserk") return 2
    else if (selectedClass == "Healer") return 3
    else if (selectedClass == "Tank") return 4
    else return config.slotBindingPreset
}

export function getDynamicColor() {
    if (!config.slotBindingdynamicColoring) return config.slotBindingdefaultColor.getRGB()

    let preset = getPreset()
    if (preset == 0) return Renderer.AQUA
    else if (preset == 1) return Renderer.GOLD
    else if (preset == 2) return Renderer.RED
    else if (preset == 3) return Renderer.LIGHT_PURPLE
    else if (preset == 4) return Renderer.DARK_GREEN
    else return config.slotBindingdefaultColor.getRGB()
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