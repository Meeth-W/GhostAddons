import PogObject from "../../PogData";

export const data = new PogObject("GhostAddons", {
    recently_closed: false,
    slotBinding: {
        presets: [ // {Inventory Slot: Hotbar Slot}
            {}, {}, {}, {}, {}, {}, {}
        ],
        history: [ // [Last Swap, Default Swap]
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null },
            { '36':null, '37':null, '38':null, '39':null, '40':null, '41':null, '42':null, '43':null, '44':null }
        ]
    },
    partyFinder: {
        uuids: {
            blacklist: [],
            whitelist: []
        }, 
        igns: {
            blacklist: [],
            whitelist: []
        },
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
    },
    invincibilityTimerGui: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    },
    relicTimer: {
        Purple: 999,
        Blue: 999,
        Red: 999,
        Green: 999,
        Orange: 999
    },
    fastLeapGui: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    }
}, 'data/mainData.json')

export default class Data {
    static players = {}
    static invalidKey = false
    static requests = []

    // only allow 2 simultaneous calls to SkyCrypt API
    static staggerRequest(request) {
        this.requests.push({
            request: request,
            active: false
        })
        this.processNextRequest()
    }

    static processNextRequest() {
        if(this.requests.some(x => !x.active) && this.requests.filter(x => x.active).length <= 1) {
            const index = this.requests.findIndex(x => !x.active)
            this.requests[index].active = true
            this.requests[index].request().then(() => {
                this.requests.splice(index, 1)
                this.processNextRequest()
            }).catch(e => console.log(e))
        }
    }

    static reset() {
        this.players = {}
        this.invalidKey = false
    }
}
