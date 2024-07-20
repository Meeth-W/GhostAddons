import PogObject from "../../PogData";

export const data = new PogObject("GhostAddons", {
    slotBinding: {
        presets: { // {Inventory Slot: Hotbar Slot}
            Archer: {}, Berserk: {}, Mage: {}, Tank: {}, Healer: {}, General: {}, Kuudra: {}
        },
        history: { // [Last Swap, Default Swap]
            _36: [null, null], _37: [null, null], _38: [null, null], _39: [null, null], _40: [null, null], _41: [null, null], _42: [null, null], _43: [null, null], _44: [null, null]
        }
    }
}, 'data/mainData.json')