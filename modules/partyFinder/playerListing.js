import config from "../../config";
import { data } from "../../utils/data"
import { playerData } from "../../utils/player";

export function listingCommand(type, ...args) {
	if (!args) args = [];
	args = args.filter(arg => arg !== null);

	if (type == 'blacklist') {
		if (args[0] == `add`) {
			player = new playerData(args[1])
		} else if (args[0] == `remove`) {
			// remove from db
		}
	} else if (type == 'whitelist') {
		if (args[0] == 'add') {
			// Add to whitelist
		} else if (args[0] == `remove`) {
			// remove from db
		}
	}	
}
