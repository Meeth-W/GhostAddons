import config from "../../config"
import { chat } from "../../utils/utils"

const keyTrigger = register("guiKey", (a, keyCode, b, event) => {
    if (!config().wardrobekeybinds) return
    const container = Player.getContainer();
    if (!container) return;
	if (!/^Wardrobe \(\d\/\d\)$/.test(container.getName())) return;
    for (let i = 0; i < 9; i++) {
		code = Client.getMinecraft().field_71474_y.field_151456_ac[i].func_151463_i()
        if (keyCode == code) {
            num = 36
            container.click(num + i)
            cancel(event)
        }
    }
}).unregister();

const mouseTrigger = register("guiMouseClick", (a, b, button, c, event) => {
    if (!config().wardrobekeybinds) return
	const container = Player.getContainer();
    if (!container) return;
	if (!/^Wardrobe \(\d\/\d\)$/.test(container.getName())) return;
    for (let i = 0; i < 9; i++) {
		code = Client.getMinecraft().field_71474_y.field_151456_ac[i].func_151463_i()
		if (button == 3 && code == -97) {
            num = 36
            container.click(num + i)
            cancel(event)
        }
		if (button == 4 && code == -96) {
            num = 36
            container.click(num + i)
            cancel(event)
        }
    }
}).unregister();

export function toggle() {
    if (config().randomToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Wardrobe Keybinds &amodule.")
        keyTrigger.register()
        mouseTrigger.register()
    return
    }
    if (config().debug) chat("&cStopping the &6Wardrobe Keybinds &cmodule.")
        keyTrigger.unregister()
        mouseTrigger.unregister()
    return
}
export default { toggle };
