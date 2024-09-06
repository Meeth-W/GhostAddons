import alerts from "./alerts";
import auto4 from "./auto4";
import autoEther from "./autoEther";
import autoLeap from "./autoLeap";
import bloodCamp from "./bloodCamp";
import chatEmotes from "./chatEmotes"
import diamanteAlert from "./diamanteAlert"
import doorSkip from "./doorSkip";
import dragPrio from "./dragPrio";
import dungeonStats from "./dungeonStats";
import fastLeap from "./fastLeap";
import invincibilityMessages from "./invincibilityMessages"
import invincibilityTimers from "./invincibilityTimers";
import kickMsg from "./kickMsg"
import leapAnnounce from "./leapAnnounce"
import locationMessages from "./locationMessages";
import lowballing from "./lowballing";
import melodyDisplay from "./melodyDisplay";
import melodyMsg from "./melodyMsg";
import partyFinder from "./partyFinder";
import pfoverlay from "./pfoverlay"
import ratProtection from "./ratProtection";
import relicLook from "./relicLook";
import relicTimes from "./relicTimes"
import secretHighlight from "./secretHighlight";
import secretTriggerbot from "./secretTriggerbot";
import slotBinding from "./slotBinding";
import spawnTimers from "./spawnTimers";
import termTimestamps from "./termTimestamps"
import wardrobeKeybinds from "./wardrobeKeybinds"
import watcherMoveDisplay from "./watcherMoveDisplay"


export const modules = [
   melodyDisplay, melodyMsg, chatEmotes, diamanteAlert, invincibilityMessages, kickMsg, leapAnnounce, pfoverlay, relicTimes, termTimestamps, wardrobeKeybinds, watcherMoveDisplay, slotBinding, autoLeap, alerts, locationMessages, doorSkip, ratProtection, partyFinder, dungeonStats, auto4, spawnTimers, lowballing, bloodCamp, secretHighlight, autoEther, invincibilityTimers, fastLeap, dragPrio, secretTriggerbot, relicLook
]

export function refresh_modules() {
    modules.forEach(name => {
        name.toggle() 
    })
}
export default { refresh_modules };