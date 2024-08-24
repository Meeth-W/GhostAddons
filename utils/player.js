import config from "../config"
import request from "../../requestV2"
import { chat, formatNum, getSbLevelPrefix } from "./utils"
import { data } from './data.js'
import { calcSkillLevel, convertToPBTime } from "../../BloomCore/utils/Utils"

export default class playerData {
    constructor(username, dungeonClass, classLevel, cmd = false) {
        this.username = username
        this.dungeonClass = dungeonClass
        this.classLevel = classLevel
        this.cmdUsed = cmd
        this.uuid = null
        this.rank = null
        
        this.toKick = [false, "Requirements Met."]
        this.kicked = false

        this.stats = {
            dungeons: {
                pb: {
                    catacombs: {},
                    master_catacombs: {}
                }
            },
            completions: {
                catacombs: {f1: 0, f2: 0, f3: 0, f4: 0, f5: 0, f6: 0, f7: 0},
                master_catacombs: {m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0}
            },
            experience: {
                catacombs: null,
                classes: {
                    Mage: null, Archer: null, Berserk: null, Tank: null, Healer: null
                },
                classAverage: null,
                selectedClass: null
            },
            magical_power: {
                mp: null, reforge: null
            },
            sb_level: null,
            sb_level_raw: null,
            discord: null
        }

        this.updated = { uuid: false, dungeons: false, rest: false}
    }

    init() {
        return request({url: `https://api.mojang.com/users/profiles/minecraft/${this.username}`, json: true}).then(data => {
            if (!data.id) return chat(`&cError: ${data.errorMessage}`);
            this.uuid = data.id; 
            this.updated.uuid = true;
            return this.updatePB();
        }).catch(e => chat(`§cError: ${e.reason}`));
    }

    updatePB() {
        return request({url: `https://sbd.evankhell.workers.dev/player/${this.uuid}`, headers: {'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json'}, json: true}).then(data => {
            if (!data.success) return chat(`&cError: ${data.cause}`)
            this.stats.dungeons = data.dungeons // Thank you Evan Khell :pray:
            this.stats.experience.catacombs = calcSkillLevel("catacombs", data.dungeons.cataxp)
            this.updated.dungeons = true
            return this.updateToKick()
        }).catch(e => chat(`&cError: ${e.reason}`))
    }

    updateSBE() {
        return request({url: `https://api.icarusphantom.dev/v1/sbecommands/cata/${this.username}`, headers: {'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json'}, json: true}).then(data => {
            if (!data.status) return chat(`&cError: ${data.issue}`)
                try { this.rank = (data?.data?.rank).replaceAll('Â', '') } catch (e) { this.rank = "&7" }
            this.stats.experience.selectedClass = data?.data?.dungeons?.selected_class
            this.updated.rank = true
            return this.updateToKick()
        }).catch(e => chat(`&cSBE API Error: ${e.reason}`))
    }

    updateRest() {
        return request({url: `https://sky.shiiyu.moe/api/v2/profile/${this.uuid}`, headers: {'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json'}, json: true}).then(data => {
            if (data.error) return chat(`&cError: ${data.error}`)
            const profile = Object.values(data.profiles).find(profile => profile.current === true)

            this.username = profile?.data?.display_name
            
            this.stats.magical_power.mp = profile?.raw?.accessory_bag_storage?.highest_magical_power
            let reforge = profile?.raw?.accessory_bag_storage?.selected_power
            this.stats.magical_power.reforge = reforge[0].toUpperCase() + reforge.slice(1)
            this.stats.sb_level = `${getSbLevelPrefix(profile?.raw?.leveling?.experience/100)}${parseInt(profile?.raw?.leveling?.experience/100)}`
            this.stats.sb_level_raw = profile?.raw?.leveling?.experience/100

            this.stats.experience.classes.Archer = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.archer?.experience)
            this.stats.experience.classes.Berserk = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.berserk?.experience)
            this.stats.experience.classes.Tank = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.tank?.experience)
            this.stats.experience.classes.Healer = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.healer?.experience)
            this.stats.experience.classes.Mage = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.mage?.experience) // Best Class

            this.stats.experience.classAverage = ((this.stats.experience.classes.Archer + this.stats.experience.classes.Berserk + this.stats.experience.classes.Healer + this.stats.experience.classes.Mage + this.stats.experience.classes.Tank ) / 5).toFixed(2)

            this.rank = "&6"

            this.stats.completions.master_catacombs = {
                m1: profile?.data?.dungeons?.master_catacombs?.floors["1"]?.stats?.tier_completions,
                m2: profile?.data?.dungeons?.master_catacombs?.floors["2"]?.stats?.tier_completions,
                m3: profile?.data?.dungeons?.master_catacombs?.floors["3"]?.stats?.tier_completions,
                m4: profile?.data?.dungeons?.master_catacombs?.floors["4"]?.stats?.tier_completions,
                m5: profile?.data?.dungeons?.master_catacombs?.floors["5"]?.stats?.tier_completions,
                m6: profile?.data?.dungeons?.master_catacombs?.floors["6"]?.stats?.tier_completions,
                m7: profile?.data?.dungeons?.master_catacombs?.floors["7"]?.stats?.tier_completions
            }

            this.stats.completions.catacombs = {
                f1: profile?.data?.dungeons?.catacombs?.floors["1"]?.stats?.tier_completions,
                f2: profile?.data?.dungeons?.catacombs?.floors["2"]?.stats?.tier_completions,
                f3: profile?.data?.dungeons?.catacombs?.floors["3"]?.stats?.tier_completions,
                f4: profile?.data?.dungeons?.catacombs?.floors["4"]?.stats?.tier_completions,
                f5: profile?.data?.dungeons?.catacombs?.floors["5"]?.stats?.tier_completions,
                f6: profile?.data?.dungeons?.catacombs?.floors["6"]?.stats?.tier_completions,
                f7: profile?.data?.dungeons?.catacombs?.floors["7"]?.stats?.tier_completions
            }
            
            this.updated.rest = true
            return this.updateSBE()
        }).catch(e => chat(`&cError: ${e.reason}`))
    }

    updateToKick() {
        if (this.updated.dungeons && !this.updated.rest && !this.kicked) { // PB, Cata Level, Secrets, Class XP
            if ( data.partyFinder.blacklist[this.uuid] ) return this.toKick = [true, `Blacklisted Player. Reason: ${data.partyFinder.blacklist[this.uuid].reason}`]
            if ( data.partyFinder.whitelist[this.uuid] ) return this.toKick = [false, `Whitelisted Player`]
            
            // PB 
            let pb = this.getSelectPB()[1]['rawS+']
            switch ( config().partyFinderminPB ) {
                case 0: // 4:40 = 280000
                    if ( parseInt(pb) > 280000) { return this.toKick = [true, `Slow PB: [${this.getSelectPB()[1]['S+']} > 4:40]`] } break;
                case 1: // 5:00 = 300000
                    if ( parseInt(pb) > 300000) { return this.toKick = [true, `Slow PB: [${this.getSelectPB()[1]['S+']} > 5:00]`] } break;
                case 2: // 5:30 = 330000
                    if ( parseInt(pb) > 330000) { return this.toKick = [true, `Slow PB: [${this.getSelectPB()[1]['S+']} > 5:30]`] } break;
                case 3: // 6:00 = 360000
                    if ( parseInt(pb) > 360000) { return this.toKick = [true, `Slow PB: [${this.getSelectPB()[1]['S+']} > 6:00]`] } break;
                case 4: // Custom PB
                    if ( parseInt(pb) > parseInt(config().partyFindercustomMinPB)) { return this.toKick = [true, `Slow PB: [${convertToPBTime(pb)} > ${convertToPBTime(parseInt(config().partyFindercustomMinPB))}]`] } break;
            }

            // Cata Level
            if ( parseFloat(this.stats.experience.catacombs) < config().partyFinderminCata ) return this.toKick = [true, `Low Cata: [${this.stats.experience.catacombs} < ${config().partyFinderminCata}]`]

            // Secrets 
            if (parseInt(this.stats.dungeons.secrets) < parseInt(config().partyFinderminSecrets)) return this.toKick = [true, `Low Secret Count: [${this.stats.dungeons.secrets} < ${config().partyFinderminSecrets}]`]

            // Class XP
            if (parseInt(this.classLevel) < config().partyFinderminClass) return this.toKick = [true, `Low Class Level: [${this.classLevel} < ${config().partyFinderminClass}]`]

        } if (this.updated.rest && !this.kicked) { // SB Level, MP
            if ( data.partyFinder.blacklist[this.uuid] ) return this.toKick = [true, `Blacklisted Player. Reason: ${data.partyFinder.blacklist[this.uuid].reason}`] // Second ouccurance just incase.
            if ( data.partyFinder.whitelist[this.uuid] ) return this.toKick = [false, `Whitelisted Player`]
            
            // Magical Power
            if (parseInt(this.stats.magical_power.mp) < parseInt(config().partyFinderminMP)) return this.toKick = [true, `Low Magical Power: [${this.stats.magical_power.mp} < ${config().partyFinderminMP}]`]

            // SB Level
            if (parseInt(this.stats.sb_level_raw) < parseInt(config().partyFinderminLvl)) return this.toKick = [true, `Low Skyblock Level: [${this.stats.sb_level_raw} < ${config().partyFinderminLvl}]`]
        }
    }
    
    getSelectPB() {
        if (!this.updated.dungeons) return chat(`&cError: No player data.`)
        if (config().partyFinderDungeonType == 0) {
            switch (config().partyFinderDungeonFloor) {
                case 0: return ['F1', this.stats.dungeons.pb.catacombs['1']]
                case 1: return ['F2', this.stats.dungeons.pb.catacombs['2']]
                case 2: return ['F3', this.stats.dungeons.pb.catacombs['3']]
                case 3: return ['F4', this.stats.dungeons.pb.catacombs['4']]
                case 4: return ['F5', this.stats.dungeons.pb.catacombs['5']]
                case 5: return ['F6', this.stats.dungeons.pb.catacombs['6']]
                case 6: return ['F7', this.stats.dungeons.pb.catacombs['7']]
            }
        } else {
            switch (config().partyFinderDungeonFloor) {
                case 0: return ['M1', this.stats.dungeons.pb.master_catacombs['1']]
                case 1: return ['M2', this.stats.dungeons.pb.master_catacombs['2']]
                case 2: return ['M3', this.stats.dungeons.pb.master_catacombs['3']]
                case 3: return ['M4', this.stats.dungeons.pb.master_catacombs['4']]
                case 4: return ['M5', this.stats.dungeons.pb.master_catacombs['5']]
                case 5: return ['M6', this.stats.dungeons.pb.master_catacombs['6']]
                case 6: return ['M7', this.stats.dungeons.pb.master_catacombs['7']]
            }
        }
        return ["M10", {"S": null, "S+": null, "rawS": null, "rawS+": null}]
    }

    getSelectComps() {
        if (!this.updated.rest) return chat(`&cError: No player data.`)
            if (config().partyFinderDungeonType == 0) {
                switch (config().partyFinderDungeonFloor) {
                    case 0: return ['F1', this.stats.completions.catacombs.f1]
                    case 1: return ['F2', this.stats.completions.catacombs.f2]
                    case 2: return ['F3', this.stats.completions.catacombs.f3]
                    case 3: return ['F4', this.stats.completions.catacombs.f4]
                    case 4: return ['F5', this.stats.completions.catacombs.f5]
                    case 5: return ['F6', this.stats.completions.catacombs.f6]
                    case 6: return ['F7', this.stats.completions.catacombs.f7]
                }
            } else {
                switch (config().partyFinderDungeonFloor) {
                    case 0: return ['M1', this.stats.completions.master_catacombs.m1]
                    case 1: return ['M2', this.stats.completions.master_catacombs.m2]
                    case 2: return ['M3', this.stats.completions.master_catacombs.m3]
                    case 3: return ['M4', this.stats.completions.master_catacombs.m4]
                    case 4: return ['M5', this.stats.completions.master_catacombs.m5]
                    case 5: return ['M6', this.stats.completions.master_catacombs.m6]
                    case 6: return ['M7', this.stats.completions.master_catacombs.m7]
                }
            }
            return ['M10', 0]
    }

    getString() {
        return [
            `&${this.toKick[0]? "c":"a"}&l&m--------------------`,
            `&8[${(this.updated.rest)? this.stats.sb_level: "&r&k...&r"}&8] ${(this.updated.rest)? this.rank: "&6"} ${this.username}`, // TODO: Rank Integration.
            `&c☠ Cata Level: &e${(this.updated.dungeons)? this.stats.experience.catacombs: "&k...&r"}`,
            ` `,
            `&f&l⚛&r &fClass Average: &e${(this.updated.rest)? this.stats.experience.classAverage: "&k...&r"}`,
            `&c➶ Archer Level: &e${(this.updated.rest)? this.stats.experience.classes.Archer:(this.dungeonClass == "Archer")? this.classLevel: "&k...&r"} ${(this.dungeonClass == "Archer" && !this.cmdUsed)? "&c&l←": ""}`,
            `&6☄ Berserk Level: &e${(this.updated.rest)? this.stats.experience.classes.Berserk:(this.dungeonClass == "Berserk")? this.classLevel: "&k...&r"} ${(this.dungeonClass == "Berserk" && !this.cmdUsed)? "&6&l←)": ""}`,
            `&a⚓Tank Level: &e${(this.updated.rest)? this.stats.experience.classes.Tank:(this.dungeonClass == "Tank")? this.classLevel: "&k...&r"} ${(this.dungeonClass == "Tank" && !this.cmdUsed)? "&a&l←": ""}`,
            `&b⚡ Mage Level: &e${(this.updated.rest)? this.stats.experience.classes.Mage:(this.dungeonClass == "Mage")? this.classLevel: "&k...&r"} ${(this.dungeonClass == "Mage" && !this.cmdUsed)? "&b&l←": ""}`,
            `&d⚚ Healer Level: &e${(this.updated.rest)? this.stats.experience.classes.Healer:(this.dungeonClass == "Healer")? this.classLevel: "... "} ${(this.dungeonClass == "Healer" && !this.cmdUsed)? "&d&l←": ""}`,
            ` `,
            `&bMagical Power: &6${(this.updated.rest)? formatNum(this.stats.magical_power.mp): "&k...&r"} | ${(this.updated.rest)? this.stats.magical_power.reforge: "&k...&r"}`,
            `&bSecret Count: &6${(this.updated.dungeons)? formatNum(this.stats.dungeons.secrets): "&k...&r"} | ${(this.updated.dungeons)? (this.stats.dungeons.secrets / this.stats.dungeons.runs).toFixed(2): "&k...&r"} SPR`,
            ` `,
            `&a${(this.updated.dungeons)? this.getSelectPB()[0]: "&k...&r"} PB: &6${(this.updated.dungeons)? this.getSelectPB()[1]['S+']:"&k...&r"}`,
            `&a${(this.updated.rest)? this.getSelectComps()[0]: "&k...&r"} Completions: &6${(this.updated.rest)? formatNum(this.getSelectComps()[1]): "&k...&r"}`,
            `&aTotal Completions: &6${(this.updated.dungeons)? formatNum(this.stats.dungeons.runs): "&k...&r"}`,
            ` `,
            `&dKick:${(this.toKick[0])? '&c': '&a'} ${this.toKick[1]}`,
            `&${this.toKick[0]? "c":"a"}&l&m--------------------`
        ]
    }
}
