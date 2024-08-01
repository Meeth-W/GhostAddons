import config from "./config";
import modules from "./modules";
import { chat } from "./utils/utils";

register("command", (command, ...args) => {
    if (!command && !args) {try { return config.openGUI() } catch(e) { return chat(`&cError: ${e}`) }}
}).setName("ghostaddons").setAliases("gh");

const SettingsGui = Java.type("gg.essential.vigilance.gui.SettingsGui");
register("guiClosed", gui => {
	if (!(gui instanceof SettingsGui)) return;
    modules.modules.forEach(name => {
        name.toggle()
    })
});

modules.modules.forEach(name => {
    name.toggle() 
})