import config from "../config"
import request from "../../requestV2"
import { chat } from "./utils"
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
                    Mage: null,
                    Archer: null,
                    Berserker: null,
                    Tank: null, 
                    Healer: null
                },
                classAverage: null
            },
            magical_power: null,
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
            this.stats.experience.catacombs = Math.floor(calcSkillLevel("catacombs", data.dungeons.cataxp))
            this.updated.dungeons = true
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
                case 0: return this.stats.dungeons.pb.catacombs['1']
                case 1: return this.stats.dungeons.pb.catacombs['2']
                case 2: return this.stats.dungeons.pb.catacombs['3']
                case 3: return this.stats.dungeons.pb.catacombs['4']
                case 4: return this.stats.dungeons.pb.catacombs['5']
                case 5: return this.stats.dungeons.pb.catacombs['6']
                case 6: return this.stats.dungeons.pb.catacombs['7']
            }
        } else {
            switch (config.partyFinderDungeonFloor) {
                case 0: return this.stats.dungeons.pb.master_catacombs['1']
                case 1: return this.stats.dungeons.pb.master_catacombs['2']
                case 2: return this.stats.dungeons.pb.master_catacombs['3']
                case 3: return this.stats.dungeons.pb.master_catacombs['4']
                case 4: return this.stats.dungeons.pb.master_catacombs['5']
                case 5: return this.stats.dungeons.pb.master_catacombs['6']
                case 6: return this.stats.dungeons.pb.master_catacombs['7']
            }
        }
        return {"S": null, "S+": null, "rawS": null, "rawS+": null}
    }
}