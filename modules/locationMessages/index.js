import config from "../../config"
import { chat, inRange } from "../../utils/utils"

let text = new Text('').setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.RED)
let startTime
let name
let action
let place

let messagesSent = {
    'ssMessage': [true, [107, 110], [120, 121], [93, 95]],
    'pre2': [true, [54, 58], [108, 110], [130, 132]],
    'i3': [true, [0, 4], [120, 121], [76, 79]],
    'pre3': [true, [1, 3], [108, 110], [98, 102]],
    'slingshot': [true, [53, 56], [114, 115], [51, 54]],
    'tunnel': [true, [52, 57], [113, 115], [55, 58]],
    'pre4': [true, [35, 39], [108, 110], [34, 36]],
}

const locationNotifTrigger = register("chat", (n, a, p) => {
    name = n
    action = a
    place = p
    startTime = Date.now()
}).setCriteria(/Party > .+ (\w+): (At|Inside) (.+)(!)?/).unregister()

const locationNotifRender = register("renderOverlay", () => {
    if (!(config.locationNotif && startTime && name != Player.getName())) return
    const remaining = (1500 - (Date.now() - startTime ?? 0))
    if (remaining < 0) return

    text.setString(`${name} is ${action} ${place}!`)
    text.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 50)
    World.playSound(config.locationSound, 2, 2)
}).unregister()

const stormEnd = register('chat', () => {
    messagesSent.ssMessage[0] = false
}).setCriteria("[BOSS] Storm: I'd be happy to show you what that's like!").unregister()

const goldorStart = register('chat', () => {
    messagesSent.pre2[0] = false
    messagesSent.pre3[0] = false
    messagesSent.i3[0] = true
    messagesSent.slingshot[0] = false
    messagesSent.tunnel[0] = false
    messagesSent.pre4[0] = false
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?").unregister()

const maxorEnd = register('chat', () => {
    messagesSent.i3[0] = false
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!").unregister()

const goldorEnd = register('chat', () => {
    messagesSent.tunnel[0] = true
    messagesSent.slingshot[0] = true
    messagesSent.pre2[0] = true
    messagesSent.pre3[0] = true
    messagesSent.pre4[0] = true
}).setCriteria("The Core entrance is opening!").unregister()

const mainTrigger = register('tick', () => {
    if (!messagesSent.ssMessage[0] && config.ssCoord && inRange(messagesSent.ssMessage)) {
        ChatLib.command('pc At SS!')
        messagesSent.ssMessage[0] = true
        return
    }

    if (!messagesSent.pre2[0] && config.pre2Coord && inRange(messagesSent.pre2)) {
        ChatLib.command('pc At Pre Enter 2!')
        messagesSent.pre2[0] = true
        return
    }

    if (!messagesSent.i3[0] && config.i3Coord && inRange(messagesSent.i3)) {
        ChatLib.command('pc At Insta 3!')
        messagesSent.i3[0] = true
        return
    }

    if (!messagesSent.pre3[0] && config.pre3Coord && inRange(messagesSent.pre3)) {
        ChatLib.command('pc At Pre Enter 3!')
        messagesSent.pre3[0] = true
        return
    }

    if (!messagesSent.pre4[0] && config.pre4Coord && inRange(messagesSent.pre4)) {
        ChatLib.command('pc At Pre Enter 4!')
        messagesSent.pre4[0] = true
        return
    }

    if (!messagesSent.slingshot[0] && config.slingshotCoord && inRange(messagesSent.slingshot)) {
        ChatLib.command('pc At Core!')
        messagesSent.slingshot[0] = true
        return
    }

    if (!messagesSent.tunnel[0] && config.tunnelCoord && inRange(messagesSent.tunnel)) {
        ChatLib.command('pc Inside Goldor Tunnel!')
        messagesSent.tunnel[0] = true
        return
    }
}).unregister()

const messageReset = register('worldLoad', () => {
    messagesSent = {
        'ssMessage': [true, [107, 110], [120, 121], [93, 95]],
        'pre2': [true, [54, 58], [108, 110], [130, 132]],
        'i3': [true, [0, 4], [120, 121], [76, 79]],
        'pre3': [true, [1, 3], [108, 110], [98, 102]],
        'slingshot': [true, [53, 56], [114, 115], [51, 54]],
        'tunnel': [true, [52, 57], [113, 115], [55, 58]],
        'pre4': [true, [35, 39], [108, 110], [34, 36]],
    }
})


export function toggle() {
    if (config.locationMessagesToggle && config.toggle) {
        if (config.debug) chat("&aStarting the &6Location Messages &amodule.")
        messageReset.register()
        if (config.locationNotif) {
            locationNotifTrigger.register()
            locationNotifRender.register()
        }
        stormEnd.register()
        goldorStart.register()
        maxorEnd.register()
        goldorEnd.register()
        mainTrigger.register()
        return
    }
    if (config.debug) chat("&cStopping the &6Location Messages &cmodule.")
    messageReset.unregister()
    if (config.locationNotif) {
        locationNotifTrigger.unregister()
        locationNotifRender.register()
    }
    stormEnd.unregister()
    goldorStart.unregister()
    maxorEnd.unregister()
    goldorEnd.unregister()
    mainTrigger.unregister()
    return
}
export default { toggle };