import PogObject from "../../PogData";

export const data = new PogObject("GhostAddons", {
    slotBinding: {
        presets: [ // {Inventory Slot: Hotbar Slot}
            {}, {}, {}, {}, {}, {}
        ],
        history: [ // [Last Swap, Default Swap]
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null }
        ]
    },
    partyFinder: { // Structure: "uuid": { "ign": "", "datetime": "", "reason": "" }
        blacklist: {
            
        },
        whitelist: {
        }
    },
    relicSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    },
    dragonSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 40,
        scale: 3
    },
    crystalSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    }
}, 'data/mainData.json')
