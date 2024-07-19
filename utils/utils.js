export const prefix = "§8[&6Ghost&8]§r "
const defaultColor = "§7"

export function chat(message , id = null) {
    if (!id) return ChatLib.chat(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor))
    new Message(message).setChatLineId(id).chat()
}

