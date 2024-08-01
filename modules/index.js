import alerts from "./alerts";
import auto4 from "./auto4";
import autoLeap from "./autoLeap";
import doorSkip from "./doorSkip";
import dungeonStats from "./dungeonStats";
import locationMessages from "./locationMessages";
import partyFinder from "./partyFinder";
import ratProtection from "./ratProtection";
import slotBinding from "./slotBinding";

export const modules = [
    slotBinding, autoLeap, alerts, locationMessages, doorSkip, ratProtection, partyFinder, dungeonStats, auto4
]

export default { modules };