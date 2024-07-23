import PogObject from "../../PogData";

export const data = new PogObject("GhostAddons", {
    slotBinding: {
        presets: [ // {Inventory Slot: Hotbar Slot}
            {}, {}, {}, {}, {}, {}
        ],
        history: { // [Last Swap, Default Swap]
            '36': {last: null, default: null, target: 36},
            '37': {last: null, default: null, target: 37}, 
            '38': {last: null, default: null, target: 38}, 
            '39': {last: null, default: null, target: 39}, 
            '40': {last: null, default: null, target: 40}, 
            '41': {last: null, default: null, target: 41}, 
            '42': {last: null, default: null, target: 42}, 
            '43': {last: null, default: null, target: 43}, 
            '44': {last: null, default: null, target: 44}
        }
    }
}, 'data/mainData.json')

// TODO: Improve data structure, last & default both are redundant. Only need one. 
