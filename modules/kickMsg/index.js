import config from "../../config"
import { chat } from '../../utils/utils';

const trigger = register("chat", () => {
    if (config().cdKick) ChatLib.command("pc " + config().cdKickText);
}).setCriteria("You were kicked while joining that server!").unregister();

export function toggle() {
    if (config().randomToggle && config().toggle) {
        if (config().debug) chat("&aStarting the &6Kick Message &amodule.")
        trigger.register()
        return
    }
    if (config().debug) chat("&cStopping the &6Kick Message &cmodule.")
        trigger.unregister()
        return
}
export default { toggle };