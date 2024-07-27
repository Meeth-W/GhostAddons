import alerts from "./alerts";
import autoLeap from "./autoLeap";
import doorSkip from "./doorSkip";
import locationMessages from "./locationMessages";
import partyFinder from "./partyFinder";
import slotBinding from "./slotBinding";

export const modules = [
    partyFinder, slotBinding, autoLeap, alerts, locationMessages, doorSkip
]

export default { modules };