import alerts from "./alerts";
import auto4 from "./auto4";
import autoEther from "./autoEther";
import autoLeap from "./autoLeap";
import bloodCamp from "./bloodCamp";
import doorSkip from "./doorSkip";
import dungeonStats from "./dungeonStats";
import locationMessages from "./locationMessages";
import lowballing from "./lowballing";
import partyFinder from "./partyFinder";
import ratProtection from "./ratProtection";
import secretHighlight from "./secretHighlight";
import slotBinding from "./slotBinding";
import spawnTimers from "./spawnTimers";

export const modules = [
    slotBinding, autoLeap, alerts, locationMessages, doorSkip, ratProtection, partyFinder, dungeonStats, auto4, spawnTimers, lowballing, bloodCamp, secretHighlight, autoEther
]

export default { modules };