import config from "../../config"
import { chat } from "../../utils/utils"

const bindKey = new KeyBind("Bind Slots", Keyboard.KEY_NONE, "GhostAddons")

const onShiftClick = (slot) => {
    const container = Player.getContainer()
}

let cursor = null
const onKeyClick = (slot) => {

}

const mainTrigger = register("guiMouseClick", (x, y, mouseButton, gui, event) => {
    return
});

const guiTrigger = register('guiRender', (x, y, gui) => {
    if (gui.class.getName() !== "net.minecraft.client.gui.inventory.GuiInventory") return;
});

export function toggle() {
    if (config.slotBindingToggle && config.toggle) {
        chat("&aStarting the &6Slot Binding &amodule.")
        mainTrigger.register()
        guiTrigger.register()
        return
    }
    chat("&cStopping the &6Slot Binding &cmodule.")
    mainTrigger.unregister()
    guiTrigger.unregister()
    return
}
export default { toggle };