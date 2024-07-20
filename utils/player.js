import config from "../config"
import request from "../../requestV2"
import { chat, getSbLevelPrefix } from "./utils"
import { calcSkillLevel } from "../../BloomCore/utils/Utils"

export default class playerData {
    constructor(username) {
        this.username = username
        this.uuid = null
        
        this.toKick = [false, "Requirements Met."]

        this.stats = {
            dungeons: {
                pb: {
                    catacombs: {},
                    master_catacombs: {}
                }
            },
            completions: {
                catacombs: {},
                master_catacombs: {}
            },
            experience: {
                catacombs: null,
                classes: {
                    Mage: null, Archer: null, Berserker: null, Tank: null, Healer: null
                },
                classAverage: null
            },
            magical_power: {
                mp: null, reforge: null
            },
            sb_level: null
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

    updateRest() {
        return request({url: `https://sky.shiiyu.moe/api/v2/profile/${this.uuid}`, headers: {'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json'}, json: true}).then(data => {
            if (data.error) return chat(`&cError: ${data.error}`)
            const profile = Object.values(data.profiles).find(profile => profile.current === true)
            chat(profile[`profile_id`])

            this.stats.magical_power.mp = profile?.raw?.accessory_bag_storage?.highest_magical_power
            this.stats.magical_power.reforge = profile?.raw?.accessory_bag_storage?.selected_power
            this.stats.sb_level = `${getSbLevelPrefix(profile?.raw?.leveling?.experience/100)}${profile?.raw?.leveling?.experience/100}`

            this.stats.experience.classes.Archer = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.archer?.experience)
            this.stats.experience.classes.Berserker = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.berserk?.experience)
            this.stats.experience.classes.Tank = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.tank?.experience)
            this.stats.experience.classes.Healer = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.healer?.experience)
            this.stats.experience.classes.Mage = calcSkillLevel("catacombs", profile?.raw?.dungeons?.player_classes?.mage?.experience) // Best Class

            this.stats.experience.classAverage = ((this.stats.experience.classes.Archer + this.stats.experience.classes.Berserker + this.stats.experience.classes.Healer + this.stats.experience.classes.Mage + this.stats.experience.classes.Tank ) / 5).toFixed(2)

            this.updated.rest = true
            return this.updateToKick()
        }).catch(e => chat(`&cError: ${e.reason}`))
    }

    updateToKick() {
        return
    }
    
    getSelectPB() {
        if (!this.updated.dungeons) return chat(`&cError: No player data.`)
        if (config.partyFinderDungeonType == 0) {
            switch (config.partyFinderDungeonFloor) {
                case 0: return ['F1', this.stats.dungeons.pb.catacombs['1']]
                case 1: return ['F2', this.stats.dungeons.pb.catacombs['2']]
                case 2: return ['F3', this.stats.dungeons.pb.catacombs['3']]
                case 3: return ['F4', this.stats.dungeons.pb.catacombs['4']]
                case 4: return ['F5', this.stats.dungeons.pb.catacombs['5']]
                case 5: return ['F6', this.stats.dungeons.pb.catacombs['6']]
                case 6: return ['F7', this.stats.dungeons.pb.catacombs['7']]
            }
        } else {
            switch (config.partyFinderDungeonFloor) {
                case 0: return ['M1', this.stats.dungeons.pb.master_catacombs['1']]
                case 1: return ['M2', this.stats.dungeons.pb.master_catacombs['2']]
                case 2: return ['M3', this.stats.dungeons.pb.master_catacombs['3']]
                case 3: return ['M4', this.stats.dungeons.pb.master_catacombs['4']]
                case 4: return ['M5', this.stats.dungeons.pb.master_catacombs['5']]
                case 5: return ['M6', this.stats.dungeons.pb.master_catacombs['6']]
                case 6: return ['M7', this.stats.dungeons.pb.master_catacombs['7']]
            }
        }
        return {"S": null, "S+": null, "rawS": null, "rawS+": null}
    }

    getString(dungeonClass, classLevel) {
        return [
            `&${this.toKick[0]? "c":"a"}&l&m--------------------`,
            `&8[${(this.updated.rest)? this.stats.sb_level: "&r..."}&8] &6${this.username}`, // TODO: Rank Integration.
            `&c☠ Cata Level: &e${(this.updated.dungeons)? this.stats.experience.catacombs: "..."}`,
            ` `,
            `&f&l⚛&r &fClass Average: &e${(this.updated.rest)? this.stats.experience.classAverage: "..."}`,
            `&c☣ Archer Level: &e${(this.updated.rest)? this.stats.experience.classes.Archer:(dungeonClass == "Archer")? classLevel: "..."}`,
            `&6⚔ Berserk Level: &e${(this.updated.rest)? this.stats.experience.classes.Berserker:(dungeonClass == "Berserk")? classLevel: "..."}`,
            `&a❈ Tank Level: &e${(this.updated.rest)? this.stats.experience.classes.Tank:(dungeonClass == "Tank")? classLevel: "..."}`,
            `&b✎ Mage Level: &e${(this.updated.rest)? this.stats.experience.classes.Mage:(dungeonClass == "Mage")? classLevel: "..."}`,
            `&d❤ Healer Level: &e${(this.updated.rest)? this.stats.experience.classes.Healer:(dungeonClass == "Healer")? classLevel: "..."}`,
            ` `,
            `&bMagical Power: &6${(this.updated.rest)? this.stats.magical_power.mp: "..."} | ${(this.updated.rest)? this.stats.magical_power.reforge: "..."}`,
            `&bSecret Count: &6${(this.updated.dungeons)? this.stats.dungeons.secrets: "..."}`,
            ` `,
            `&aHighlighed PB: &6${(this.updated.dungeons)? this.getSelectPB()[0]: "..."} | ${(this.updated.dungeons)? this.getSelectPB()[1]['S+']:"..."}`,
            `&aTotal Completions: &6${this.stats.dungeons.runs}`,
            `&${this.toKick[0]? "c":"a"}&l&m--------------------`
        ]
    }
}