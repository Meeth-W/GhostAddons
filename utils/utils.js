import { convertToPBTime } from "../../BloomCore/utils/Utils"

export const prefix = "§8[&6Ghost&8]§r "
const defaultColor = "§7"

export function chat(message , id = null) {
    if (!id) return ChatLib.chat(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor))
    new Message(message).setChatLineId(id).chat()
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