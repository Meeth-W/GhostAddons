/// <reference types="../CTAutocomplete" />

import config from "./config";
import mainCommand from "./events/mainCommand";
import { chat } from "./utils/utils";

mainCommand.addListener(undefined, () => config.openGUI());
mainCommand.addListener("help", () => {
    let helpstrings = [
        ` `
    ]
    chat(helpstrings.join("\n"))
})


import { modules } from "./modules";

const SettingsGui = Java.type("gg.essential.vigilance.gui.SettingsGui");

modules.update()

register("guiClosed", gui => {
	if (!(gui instanceof SettingsGui)) return;
	modules.update()
});

