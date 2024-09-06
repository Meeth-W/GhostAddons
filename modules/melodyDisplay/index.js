import config from "../../config";
import { chat } from "../../utils/utils";

let playerName = "";
let melodyProgress = "";
let furthestAlongMelody = 0;
let currentMelodyProgress = 0;
let renderMessage = false;
let gateDestroyed = false;
let allTerminalsCompleted = false;
let inP3 = false


const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");

// Melody
const main = register("chat", (event) => {
    if (!config().melodyWarningEnabled) return;
    if (!inP3) return;
    const message = ChatLib.removeFormatting(ChatLib.getChatMessage(event));
    // ChatLib(message) // Debug 

    // Display Melody Warning
    if (message.startsWith("Party > ")) {
        // ChatLib("message started with correct criteria")
        let melodyMatch = message.match(/\bParty\b .* (\w+): .*(\d)\/4/); // Regular expression for melody 1/4 etc message
        let melodyMatchDoubleParty = message.match(/\bParty\b .* (\w+): .*\bParty\b .* (?:\w+): .*(\d)\/4/)
        let melodyMatchDoublePartyPercent = message.match(/\bParty\b .* (\w+): .*\bParty\b .* (?:\w+): .*(\d\d)%/)
        let melodyMatchPercent = message.match(/\bParty\b .* (\w+): .*(\d\d)%/); // Regular expression for melody 25% etc message
        let noProgressMelody = message.match(/\bParty\b .* (\w+): (.*)/); // Regular expression for melody 0/4 (no progress display)
        // ChatLib(playerName)
        if (noProgressMelody[1] == Player.getName()) return;
        if (melodyMatchDoubleParty) {
            currentMelodyProgress = melodyMatchDoubleParty[2];
            if (currentMelodyProgress >= 4) { resetMelody(); return; }
            // ChatLib(currentMelodyProgress + " and furthest along is " + furthestAlongMelody)
            if (currentMelodyProgress > furthestAlongMelody || furthestAlongMelody === 0) {
                playerName = melodyMatchDoubleParty[1]; // gets player name
                furthestAlongMelody = currentMelodyProgress;
                melodyProgress = ` ${currentMelodyProgress}/4`;
                renderMessage = true;
                playSound();
            }
        } else if (melodyMatchDoublePartyPercent) {
            currentMelodyProgress = (melodyMatchDoublePartyPercent[2] / 25)
            if (currentMelodyProgress >= 4) { resetMelody(); return; }
            if (currentMelodyProgress > furthestAlongMelody || furthestAlongMelody === 0) {
                playerName = melodyMatchDoublePartyPercent[1]; // gets player name
                furthestAlongMelody = currentMelodyProgress;
                melodyProgress = ` ${currentMelodyProgress}/4`;
                renderMessage = true;
                playSound();
            }
        } else if (melodyMatch) {
            currentMelodyProgress = melodyMatch[2];
            if (currentMelodyProgress >= 4) { resetMelody(); return; }
            // ChatLib(currentMelodyProgress + " and furthest along is " + furthestAlongMelody)
            if (currentMelodyProgress > furthestAlongMelody || furthestAlongMelody === 0) {
                playerName = noProgressMelody[1]; // gets player name
                furthestAlongMelody = currentMelodyProgress;
                melodyProgress = ` ${currentMelodyProgress}/4`;
                renderMessage = true;
                playSound();
            }
        } else if (melodyMatchPercent) {
            currentMelodyProgress = (melodyMatchPercent[2] / 25)
            if (currentMelodyProgress >= 4) { resetMelody(); return; }
            if (currentMelodyProgress > furthestAlongMelody || furthestAlongMelody === 0) {
                playerName = noProgressMelody[1]; // gets player name
                furthestAlongMelody = currentMelodyProgress;
                melodyProgress = ` ${currentMelodyProgress}/4`;
                renderMessage = true;
                playSound();
            }
        } else if (messages.includes(noProgressMelody[2].toLowerCase())) {
            currentMelodyProgress = 0;
            if (currentMelodyProgress >= 4) { resetMelody(); return; }
            if (currentMelodyProgress = furthestAlongMelody || furthestAlongMelody === 0) {
                playerName = noProgressMelody[1]; // gets player name
                melodyProgress = ` 0/4`;
                renderMessage = true;
                playSound();
            }
        }
        return;
    }

    // If the person who sent melody message completes a terminal then reset melody
    let terminalMatch = message.match(/(\w+) activated a terminal! \(\d\/\d\)/);
    if (terminalMatch) {
        let terminalPlayer = terminalMatch[1];
        if (terminalPlayer === playerName) {
            renderMessage = false;
            furthestAlongMelody = 0;
        }
    }

    // Detect when all terms are complete so that we can reset melody display and stop showing it
    let terminalCompleteMatch = message.match(/.+ (activated|completed) a .+! \((\d)\/(\d)\)/)
    if (terminalCompleteMatch) {
        let current = parseInt(terminalCompleteMatch[2]);
        let total = parseInt(terminalCompleteMatch[3]);
        if (current === total) allTerminalsCompleted = true;
    }

    if (message.includes("The gate has been destroyed!")) gateDestroyed = true;

    if (message.includes("The Core entrance is opening!")) {
        inP3 = false
        resetMelody()
    }

    if (gateDestroyed && allTerminalsCompleted) resetMelody();
}).unregister()

const render = register("renderOverlay", () => {
    if (renderMessage && playerName) {
        let melodyColor;
        switch (config().melodyColor) {
            case 0:
                melodyColor = "4";
                break;
            case 1:
                melodyColor = "c";
                break;
            case 2:
                melodyColor = "6";
                break;
            case 3:
                melodyColor = "e";
                break;
            case 4:
                melodyColor = "2";
                break;
            case 5:
                melodyColor = "a";
                break;
            case 6:
                melodyColor = "b";
                break;
            case 7:
                melodyColor = "3";
                break;
            case 8:
                melodyColor = "1";
                break;
            case 9:
                melodyColor = "9";
                break;
            case 10:
                melodyColor = "d";
                break;
            case 11:
                melodyColor = "5";
                break;
            case 12:
                melodyColor = "f";
                break;
            case 13:
                melodyColor = "7";
                break;
            case 14:
                melodyColor = "8";
                break;
            case 15:
                melodyColor = "0";
                break;
        }
        const displayMessage = "&" + melodyColor + playerName + " has Melody!" + melodyProgress;
        let scale = config().melodyWarningScale
        Renderer.scale(scale)
        Renderer.drawStringWithShadow(displayMessage, (Renderer.screen.getWidth() * 0.5 - (Renderer.getStringWidth(displayMessage) * scale) / 2) / scale, (0.58 * Renderer.screen.getHeight()) / scale);
    }
}).unregister()

const resetMelody = () => {
    renderMessage = false;
    furthestAlongMelody = 0;
    gateDestroyed = false;
    allTerminalsCompleted = false;
}


register('command', (command, ...args) => {
    switch (command) {
        case "messages": {
            chat(messages.messages.join(", "));
            break;
        }
        case "add": {
            if (!args) break;
            messages.add(args);
            chat("§8[§b§8]" + args + " added to message.");
            break;
        }
        case "remove": {
            if (!args) break;
            messages.remove(args);
            chat(args + " removed from message.");
            break;
        }
        case "clear": {
            messages.clear();
            chat("Messages cleared.");
            break;
        }
        default: {
            chat(" Commands Help:");
            chat("- /melodywarning messages: List messages");
            chat("- /melodywarning add <message>: Add a message");
            chat("- /melodywarning remove <message>: Remove a message");
            chat("- /melodywarning clear: Clear messages");
            break;
        }
    }
}).setName('melodywarning')

class Messages {
    constructor() {
        this.messages = config().Messages === "" ? [] : config().Messages.split(",");
    }

    add(name) {
        this.messages.push(name);
        this.update();
    }

    remove(name) {
        if (this.messages.includes(name)) {
            this.messages.splice(this.messages.indexOf(name), 1);
            this.update();
            return true;
        } else return false;
    }

    clear() {
        this.messages = [];
        this.update();
    }

    includes(name) {
        return this.messages.includes(name);
    }

    update() {
        config().Messages = this.messages.join(",");
    }
}

const messages = new Messages();

function playSound() {
    let soundName;
    switch (config().melodyWarningSound) {
        case 0:
            soundName = "note.pling";
            break;
        case 1:
            soundName = "mob.blaze.hit";
            break;
        case 2:
            soundName = "fire.ignite";
            break;
        case 3:
            soundName = "random.orb";
            break;
    }
    try {
        new S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), 5, config().melodyWarningPitch).func_148833_a(Client.getConnection());
    } catch (error) { }
}

register("chat", (message) => {
    inP3 = true;
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("command", () => {
    ChatLib.chat("in p3")
    inP3 = true;
}).setName("debugstartp3")

register("worldLoad", () => {
    renderMessage = false;
    furthestAlongMelody = 0;
    gateDestroyed = false;
    allTerminalsCompleted = false;
    inP3 = false;
})

/*
register("chat", (message) => {
    playSound()
}).setCriteria("playsound")
*/

export function toggle() {
    if (config().bossToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Melody Display &amodule.")
            main.register()
            render.register()
            return
    }
    if (config().debug) chat("&cStopping the &6Melody Display &cmodule.")
        main.unregister()
        render.unregister()
        return
}
export default { toggle };