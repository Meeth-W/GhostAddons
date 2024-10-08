import config from "../../config";
import { chat, prefix } from "../../utils/utils";

var index = 0;
let timeSent 

const lowballMessages = [
    `Lowballing with ${config().purse} purse`,
    `Lowballing w/ ${config().purse} purse! 25m+ items`,
    `Lowballing w/ ${config().purse} purse! visit me! 25m+ items`,
    `Lowballing w/ ${config().purse} purse! 25m+ items, visit me!`
];

function convertExpression(expression) {
    expression = expression.replace(/b/g, '*1e9').replace(/m/g, '*1e6').replace(/k/g, '*1e3');
    return expression;
}
function formatNumberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
register("command", (expression) => {
    try {
        var result = formatNumberWithCommas(eval(convertExpression(expression)));
        ChatLib.chat(prefix + expression + "§a = §r" + result);
    } catch (e) {
        ChatLib.chat(prefix + "§cError in calculation");
    }
}).setName("calc").setAliases("eval", "math");

function sendLowballMessage() {
    if (Date.now() - timeSent < 5000) return chat(`&cYou're spamming this!`)
    chat(`&aSending Lowball Message ${index + 1}/${lowballMessages.length}`)
    ChatLib.command(`ac ${lowballMessages[index]}`)
    timeSent = Date.now()
    if (index == lowballMessages.length-1) index = 0
    else index++
}

const lowballButton = new KeyBind("Lowball Message", Keyboard.KEY_NONE, "GhostAddons");

lowballButton.registerKeyPress(() => {
    sendLowballMessage();
});

// Lowball Command
const commandRegister = register("command", (...args) => {
    try {
        ChatLib.chat(`&7&m${ChatLib.getChatBreak(" ")}`);
        ChatLib.chat(prefix + "§7Lowball on: §9" + args + " §f= §6" + formatNumberWithCommas(eval(convertExpression(args[0]))));
        ChatLib.chat("");
        ChatLib.chat("§7AH Tax: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.035));
        ChatLib.chat("§7Price §c- §7Tax: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.965));
        ChatLib.chat(`&7&m${ChatLib.getChatBreak(" ")}`);
        ChatLib.chat("§99% Lowball: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.91));
        ChatLib.chat("§910% Lowball: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.9));
        ChatLib.chat("§912% Lowball: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.88));
        ChatLib.chat("§915% Lowball: §6" + formatNumberWithCommas(eval(convertExpression(args[0]))*0.85));
        ChatLib.chat(`&7&m${ChatLib.getChatBreak(" ")}`);
    } catch (e) {
        ChatLib.chat(prefix + "§cError in calculation");
    }
}).setName("lb")

export function toggle() {
    return commandRegister.register();
}
export default { toggle };