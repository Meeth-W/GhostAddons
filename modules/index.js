import alerts from "./alerts";
import auto4 from "./auto4";
import autoEther from "./autoEther";
import autoLeap from "./autoLeap";
import bloodCamp from "./bloodCamp";
import doorSkip from "./doorSkip";
import dragPrio from "./dragPrio";
import dungeonStats from "./dungeonStats";
import fastLeap from "./fastLeap";
import invincibilityTimers from "./invincibilityTimers";
import locationMessages from "./locationMessages";
import lowballing from "./lowballing";
import partyFinder from "./partyFinder";
import ratProtection from "./ratProtection";
import relicLook from "./relicLook";
import secretHighlight from "./secretHighlight";
import secretTriggerbot from "./secretTriggerbot";
import slotBinding from "./slotBinding";
import spawnTimers from "./spawnTimers";

export const modules = [
    slotBinding, autoLeap, alerts, locationMessages, doorSkip, ratProtection, partyFinder, dungeonStats, auto4, spawnTimers, lowballing, bloodCamp, secretHighlight, autoEther, invincibilityTimers, fastLeap, dragPrio, secretTriggerbot, relicLook
]

export default { modules };