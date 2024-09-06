import request from "requestV2"
import { calcSkillLevel } from "BloomCore/utils/Utils"

import Data from "../utils/data.js"
import { timeToString, indexToFloor } from "../utils/calc.js"
import { handleError } from "../utils/error.js"
import { prefix } from "./utils.js"

export default class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.dungeons = {
            pb: {
                catacombs: {},
                master_catacombs: {}
            }
        }
    }

    init() {
        return request({url: `https://api.mojang.com/users/profiles/minecraft/${this.name}`, json: true}).then(data => {
            this.uuid = data.id
            return this.updateDungeonStats()
        }).catch(() => {
            request({url: `https://api.ashcon.app/mojang/v2/user/${this.name}`, json: true}).then(data => {
                this.uuid = data.uuid.replace("-", "")
                return this.updateDungeonStats()
            }).catch(e => handleError(`Could not find uuid for ${this.name}`, e.reason))
        })
    }

    updateStatsSkyCrypt() {
        Data.staggerRequest(() => {
            return request({url: `https://sky.shiiyu.moe/api/v2/dungeons/${this.uuid}`, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}).then(data => {
                // TD replace with getting selected profile once sky shiiyu api is updated
                const getCataLevel = (profile) => profile.dungeons?.catacombs?.level?.uncappedLevel
                const profile = Object.values(data["profiles"]).filter(x => getCataLevel(x)).sort((a, b) => getCataLevel(b) - getCataLevel(a))[0]

                this.dungeons.secrets = profile["dungeons"]["secrets_found"]
                this.dungeons.catalevel = profile["dungeons"]["catacombs"]["level"]["uncappedLevel"]
                this.dungeons.runs =  profile["dungeons"]["floor_completions"]

                for(let i = 1; i <= 7; i++) {
                    const dungeonTypes = ["catacombs", "master_catacombs"]
                    dungeonTypes.forEach(type => {
                        this.dungeons.pb[type][i] = this.getFloorPB(false, profile, this.uuid, type, i)
                    })
                }

                this.updateSecretAverage()
                this.changed = true
            }).catch(e => handleError(`Could not get data from SkyCrypt API for ${this.name}`, e.error))
        })
    }

    updateDungeonStats() {
        return request({url: `https://sbd.evankhell.workers.dev/player/${this.uuid}`, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}).then(data => {
            if(!data.success) {
                return this.updateStatsSkyCrypt()
            }
            this.dungeons = data.dungeons
            this.dungeons.catalevel = Math.floor(calcSkillLevel("catacombs", data.dungeons.cataxp))
            this.updateSecretAverage()
            this.changed = true
        }).catch(e => {
            handleError(`Could not get skyblock profile from SBD API for ${this.name}`, e.cause)
            return this.updateStatsSkyCrypt()
        })
    }

    getFloorPB(hypixelAPI, profile, uuid, type, floor) {
        let timeS = null
        let timeSPlus = null
        try {
            if(hypixelAPI) {
                timeS = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s"][floor]
                timeSPlus = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s_plus"][floor]
            } else {
                timeS = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s"]
                timeSPlus = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s_plus"]
            }
        } catch(e) { }
        const pb = {
            "S": timeToString(timeS),
            "S+": timeToString(timeSPlus),
            "rawS": timeS,
            "rawS+": timeSPlus
        }
        return pb
    }

    updateSecretAverage() {
        if(this.dungeons.secrets && this.dungeons.runs) {
            this.dungeons.secretAverage = (parseInt(this.dungeons.secrets) / this.dungeons.runs).toFixed(1)
        }
    }

    hasChanged() {
        const hasChanged = this.changed
        this.changed = false
        return hasChanged
    }

    toString(floorIndex = 0, pb) {
        return `${prefix} ${this.name} | §6${this.dungeons.catalevel}§r | §a${this.dungeons.secrets}§r | §b${this.dungeons.secretAverage}§r | §9${pb ?? this.dungeons.pb["catacombs"]["7"]["S+"]}§r (§e${indexToFloor(floorIndex)}§r)`
    }
}
