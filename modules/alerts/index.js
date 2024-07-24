import config from "../../config"
import { chat, getClass } from "../../utils/utils"

let showText = false
let text = new Text("")

// AutoPet
const autoPet = register("chat", (lvl, pet) => {
    World.playSound(config.alertSound, 100.0, 1.0)
    text = new Text(`${pet}`).setShadow(true).setScale(4).setColor(Renderer.LIGHT_PURPLE);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("Autopet equipped your [Lvl ${lvl}] ${pet}! VIEW RULE").unregister();

// Blood Camp
const bloodCamp = register("chat", () => {
    if (getClass() != "Mage") return
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`BLOOD READY!`).setShadow(true).setScale(4).setColor(Renderer.GOLD);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("[BOSS] The Watcher: Let's see how you can handle this.").unregister();

// P5 Rag Axe
const ragAxe = register("chat", () => {
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`RAG AXE!`).setShadow(true).setScale(4).setColor(Renderer.RED);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.").unregister();

// Tact
const tactInsert = register("chat", () => {
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`TACT!`).setShadow(true).setScale(4).setColor(Renderer.DARK_PURPLE);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("Starting in 3 seconds.").unregister();

const renderTrigger = register("renderOverlay", () => {
    if (showText) {
        text.draw((Renderer.screen.getWidth() - text.getWidth()) / 2, (Renderer.screen.getHeight() - text.getHeight()) / 2 - 50);
    }
}).unregister();

export function toggle() {
    if (config.alertToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Alerts &amodule.")
        renderTrigger.register()

        if (config.alertAutoPet) autoPet.register()
        if (config.bloodCamp) bloodCamp.register()
        if (config.alertRag) ragAxe.register()
        if (config.tactInsert) tactInsert.register()
        
        return
    }
    if (config.debug) chat("&cStopping the &6Alerts &cmodule.")
    renderTrigger.unregister()

    autoPet.unregister()
    bloodCamp.unregister()
    ragAxe.unregister()
    tactInsert.unregister()

    return
}
export default { toggle };