import config from "../config";

import partyFinder from "./partyFinder";


export const modules = {
    partyFinder
}

const modState = {};
Object.keys(modules).forEach(name => modState[name] = false)

export function update() {
	Object.keys(modState).forEach(name => {
		modules[name]?.update();
		if (config[name + "Enabled"] && config.enabled) {
			if (modState[name]) return;
			modules[name]?.enable();
		} else {
			if (!modState[name]) return;
			modules[name]?.disable();
		}
		modState[name] = config[name + "Enabled"] && config.enabled;
	});
    return 0
}

export default { modules, update };
