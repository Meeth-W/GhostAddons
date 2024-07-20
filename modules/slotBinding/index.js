import config from "../../config"
import { data } from "../../utils/data"
import { chat, getPreset } from "../../utils/utils"

const bindKey = new KeyBind("Bind Slots", Keyboard.KEY_NONE, "GhostAddons")

const getPlayerController = () => Client.getMinecraft().field_71442_b
const onShiftClick = (slot) => {
    const container = Player.getContainer()
    if (slot < 36 || slot > 44) { // Non Hotbar Click.
        const hotbarSlot = data.slotBinding.presets[getPreset()][slot] % 36
        if (hotbarSlot == null || hotbarSlot >= 9) return

        getPlayerController().func_78753_a(
            container.getWindowId(), 
            slot, 
            hotbarSlot, 
            2,
            Player.getPlayer()
        )

        // Save the swap we just did as last swap for the slot
        data.slotBinding.history[data.slotBinding.presets[getPreset()][slot]].last = slot
        return
    }
    // Hotbar Click
    if (data.slotBinding.history[slot].last) { // Last found, swap there
        const inventorySlot = data.slotBinding.history[slot].last
        if ( inventorySlot == null ) return
        
        getPlayerController().func_78753_a(
            container.getWindowId(), 
            inventorySlot, 
            slot, 
            2,
            Player.getPlayer()
        )
    } else if (data.slotBinding.history[slot].default) { // Swap w/ default
        const inventorySlot = data.slotBinding.history[slot].default
        if ( inventorySlot == null ) return
        
        getPlayerController().func_78753_a(
            container.getWindowId(), 
            inventorySlot, 
            slot, 
            2,
            Player.getPlayer()
        )

        data.slotBinding.history[slot].last = inventorySlot
    }
    return
}

let cursor = null
const onKeyLeftClick = (slot) => {
    if (cursor && (slot < 36 || slot > 44)) {
        chat(`&cError: Can't bind to slots outside the hotbar.`)
        return cursor = null
    }

    if (!cursor) cursor = slot;
    if (cursor === slot) return;

    data.slotBinding.presets[getPreset()][cursor] = slot // Save Binding
    data.slotBinding.history[slot].default = cursor // Save cursor as default swap for hotbar slot

    data.save()

    cursor = null;
}

const onKeyRightClick = (slot) => {
    if (!(slot in data.slotBinding.presets[getPreset()])) return chat(`&cError: That slot is not currently bound.`)
    hotbarSlot = data.slotBinding.presets[getPreset()][slot]

    delete data.slotBinding.presets[getPreset()][slot] // Delete Binding
    if (data.slotBinding.history[hotbarSlot].default == slot) data.slotBinding.history[hotbarSlot].default == null // Delete from history if slot is saved as default for its hotbar slot.

    chat(`&aSuccesfully Deleted: ${slot}.`)
}

const mainTrigger = register("guiMouseClick", (x, y, mouseButton, gui, event) => {
    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) return
    const slot = gui.getSlotUnderMouse()?.field_75222_d

    if (mouseButton == 1 && Keyboard.isKeyDown(bindKey.getKeyCode())) {
        cancel(event);
        onKeyRightClick(slot);
    }
    if (mouseButton == 0 && Keyboard.isKeyDown(bindKey.getKeyCode())) {
        cancel(event);
        onKeyLeftClick(slot);
    }
    if (Keyboard.isKeyDown(Keyboard.KEY_LSHIFT) && slot in data.slotBinding.presets[getPreset()]) {
        cancel(event);
        onShiftClick(slot);
    }
    return
}).unregister();

const guiTrigger = register('guiRender', (x, y, gui) => {
    if (gui.class.getName() !== "net.minecraft.client.gui.inventory.GuiInventory") return;
}).unregister();

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