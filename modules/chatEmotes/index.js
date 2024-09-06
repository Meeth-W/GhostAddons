import config from '../../config'
import { chat } from '../../utils/utils';

let replacements = {
	'<3': '❤',
	'o/': '( ﾟ◡ﾟ)/',
	':star:': '✮',
	':yes:': '✔',
	':no:': '✖',
	':java:': '☕',
	':arrow:': '➜',
	':shrug:': '¯\\_(\u30c4)_/¯',
	':tableflip:': '(╯°□°）╯︵ ┻━┻',
	':totem:': '☉_☉',
	':typing:': '✎...',
	':maths:': '√(π+x)=L',
	':snail:': "@'-'",
	':thinking:': '(0.o?)',
	':gimme:': '༼つ◕_◕༽つ',
	':wizard:': "(' - ')⊃━☆ﾟ.*･｡ﾟ",
	':pvp:': '⚔',
	':peace:': '✌',
	':puffer:': "<('O')>",
	'h/': 'ヽ(^◇^*)/',
	':sloth:': '(・⊝・)',
	':dog:': '(ᵔᴥᵔ)',
	':dj:': 'ヽ(⌐■_■)ノ♬',
	':yey:': 'ヽ (◕◡◕) ﾉ',
	':snow:': '☃',
	':dab:': '<o/',
	':cat:': '= ＾● ⋏ ●＾ =',
	':cute:': '(✿◠‿◠)',
	':skull:': '☠',
}

let replaced = false
const trigger = register('messageSent', (message, event) => {
	if (!config().chatEmotes) return
	if (message.startsWith('/') && !message.startsWith('/pc') && !message.startsWith('/ac') && !message.startsWith('/gc') && !message.startsWith('/msg') && !message.startsWith('/w') && !message.startsWith('/r')) return
	replaced = false
	message = message.split(' ')
	for (let i = 0; i < message.length; i++) {
		if (Object.keys(replacements).includes(message[i])) {
			replaced = true
			message[i] = replacements[message[i]]
		}
	}
	message = message.join(' ')
	if (!replaced) return
	cancel(event)
	ChatLib.say(message)
}).unregister();

export function toggle() {
    if (config().randomToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Chat Emotes &amodule.")
        trigger.register()
		return
    }
	if (config().debug) chat("&cStopping the &6Chat Emotes &cmodule.")
    trigger.unregister()
	return
}
export default { toggle };