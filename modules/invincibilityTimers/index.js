import config from "../../config";
import gui_config from "../../gui_config";
import { data } from "../../utils/data";
import { chat } from "../../utils/utils";

let timerText = new Text('').setScale(1).setShadow(true).setAlign('LEFT').setColor(Renderer.WHITE);
let ticks = {bonzo: 0, spirit: 0, phoenix: 0, invincible: 0};
let displayText = null

function getString() {
    return `&9Bonzo Mask: &c${(ticks.bonzo==0)? "&aREADY!": (ticks.bonzo/20)}\n&fSpirit Mask: &c${(ticks.spirit==0)? "&aREADY!": (ticks.spirit/20)}\n&6Phoenix Pet: &c${(ticks.phoenix==0)? "&aREADY!": (ticks.phoenix/20)}\n\n&bInvincible: &a${(ticks.invincible==0)? "&c✖": (ticks.invincible/20)}`
}
const tickCounter = register('tick', () => {
    if (ticks.bonzo > 0) ticks.bonzo--
    if (ticks.spirit > 0) ticks.spirit--
    if (ticks.phoenix > 0) ticks.phoenix--
    if (ticks.invincible > 0) ticks.invincible--
    if (ticks.bonzo == 0 && ticks.spirit == 0 && ticks.phoenix == 0 && ticks.invincible == 0) return tickCounter.unregister()
}).unregister();

const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");
const procCatch = register("packetReceived", (packet, event) => {
	if (packet.func_179841_c() === 2) return;
	const message = ChatLib.removeFormatting(packet.func_148915_c().func_150260_c());
    if (["Your ⚚ Bonzo's Mask saved your life!", "Your Bonzo's Mask saved your life!"].includes(message)) {
        ticks.bonzo = 180*20;
        ticks.invincible = 3*20;
        displayText = "&9&lBonzo Mask"
        tickCounter.register();
	} else if (["Second Wind Activated! Your Spirit Mask saved your life!"].includes(message)) {
        ticks.spirit = 30*20;
        ticks.invincible = 3*20;
        displayText = "&f&lSpirit Mask"
        tickCounter.register();
	} else if (["Your Phoenix Pet saved you from certain death!"].includes(message)) {
        ticks.phoenix = 60*20;
        ticks.invincible = 3*20;
        displayText = "&6&lPhoenix Pet"
        tickCounter.register();
	}
}).setFilteredClass(S02PacketChat).unregister();

const renderTrigger = register('renderOverlay', () => {
    if (!config().invincibilityToggle || !config().toggle || !config().timersToggle) return
    timerText.setString(getString())
    timerText.setScale(data.invincibilityTimerGui.scale)
    timerText.setShadow(true)
    timerText.draw(data.invincibilityTimerGui.x, data.invincibilityTimerGui.y)
}).unregister();

register('worldUnload', () => {
    tickCounter.unregister();
    ticks = {bonzo: 0, spirit: 0, phoenix: 0, invincible: 0}
});

const handleRender = register('renderOverlay', () => {
    if (ticks.invincible > 0 && config().invincibilityTimerAlert) {
        const displayColor = (ticks.invincible > 40)? "&a" : (ticks.invincible > 20)? "&e": "&c";
        if (ticks.invincible > 30) Client.Companion.showTitle((displayText)? displayText: " ", `&7Immune for: ${displayColor}${(ticks.invincible/20).toFixed(2)}`, 0, 2, 0)
        else Client.Companion.showTitle(" ", `&7Immune for: ${displayColor}${(ticks.invincible/20).toFixed(2)}`, 0, 2, 0)
    }
})

// Config Triggers.
register("renderOverlay", () => {
    if (gui_config.invincibilityTimerGui.isOpen() && !config().invincibilityToggle) {
        timerText.setString([`&9Bonzo Mask: &aREADY`, `&fSpirit Mask: &aREADY`, `&6Phoenix Pet: &aREADY`, ``, `&bInvincible: ✖`].join('\n'))
        timerText.setScale(data.invincibilityTimerGui.scale)
        timerText.draw(data.invincibilityTimerGui.x, data.invincibilityTimerGui.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (gui_config.invincibilityTimerGui.isOpen() && (bn != 2)) {
        data.invincibilityTimerGui.x = x
        data.invincibilityTimerGui.y = y
        data.save()
    }
})

register("scrolled", (x, y, dir) => {
    if (gui_config.invincibilityTimerGui.isOpen()) {
        if (dir == 1) data.invincibilityTimerGui.scale += 0.05
        else data.invincibilityTimerGui.scale -= 0.05
        data.save()
    }
})

register("guiMouseClick", (x, y, bn) => {
    if (gui_config.invincibilityTimerGui.isOpen() && (bn == 2)) {
        data.invincibilityTimerGui.x = Renderer.screen.getWidth() / 2
        data.invincibilityTimerGui.y = Renderer.screen.getHeight() / 2 + 10
        data.invincibilityTimerGui.scale = 1
        data.save()
    }
})

export function toggle() {
    if (config().timersToggle && config().toggle && config().invincibilityToggle) {
        if (config().debug) chat("&aStarting the &6Invincibility Timers &amodule.")
        renderTrigger.register();
        procCatch.register();
        if (config().invincibilityTimerAlert) handleRender.register();
        return
    }
    if (config().debug) chat("&cStopping the &6Invincibility Timers &cmodule.")
    if (!config().invincibilityToggle) {
        renderTrigger.unregister();
        procCatch.unregister();
        handleRender.unregister();
    }
    return
}
export default { toggle };