import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
import { chat, mod_chat } from "./utils/utils"
import gui_config from "./gui_config"
import { data } from "./utils/data";
export let recently_closed = false;

const defConfig = new DefaultConfig("GhostAddons", "data/settings.json")

defConfig

    .addSwitch({
        category: "General",
        configName: "toggle",
        title: "&5&lToggle Ghost Addons",
        description: "Decides whether all features of this mod are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Main Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "General",
        configName: "debug",
        title: "Debug Mode",
        description: "Debug stuff, ignore this.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Debug Mode ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "General",
        configName: "cheatToggle",
        title: "&4&lToggle Cheats",
        description: "Decides wether all &4cheat&7 features are &aenabled&7/&cdisabled&7.",
        subcategory: "Cheater",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Cheat Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addButton({
        category: "General", 
        configName: "openGUI", 
        title: "Open Move GUI",
        description: "Click to open a Vigilance GUI to move gui locations.", 
        onClick(setting){
            gui_config.openGUI()
        }
    })
    .addSwitch({
        category: "Party Finder",
        configName: "partyFinderToggle",
        title: "&9Toggle Party Finder",
        description: "Decides wether all features in Party Finder are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Party Finder",
        configName: "partyFinderAutoKick",
        title: "&9Toggle Auto Kick",
        description: "Decides wether players are automatically kicked from the party.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Auto Kick ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addColorPicker({
        category: "Party Finder",
        configName: "m7StatsBackgroundColor",
        title: "Menu Background",
        description: "Background color for the Stats Menu.\nAccessed through /nicepb {user} or /m7stats {user}",
        value: [255, 255, 255, 255],
        subcategory: "Stats Command",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Party Chat ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Party Finder",
        configName: "partyFinderPartyChat",
        title: "Party Chat",
        description: "Send an overview / kick message in party chat.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Only Kick Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Party Finder",
        title: "Only Kick Messages",
        description: "Only sends a message when a user is kicked from the party.",
        configName: "partyFinderOnlyKickMessage",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Only Kick Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Party Finder",
        configName: "blacklist",
        title: "&cAutokick Blacklist",
        description: "Automatically Kicks Blacklisted Players.",
        subcategory: ""
    })
    .addSwitch({
        category: "Party Finder",
        configName: "whitelist",
        title: "&2Autokick Whitelist",
        description: "Doesnt Kick Whitelisted Players.",
        subcategory: ""
    })
    .addDropDown({
        category: "Party Finder",
        configName: "partyFinderDungeonType",
        title: "Dungeon Type",
        description: "Select the floor type to check stats for.",
        options: ["Catacombs","Master Catacombs"],
        value: 0,
        subcategory: "Floor Settings"
    })
    .addDropDown({
        category: "Party Finder",
        configName: "partyFinderDungeonFloor",
        title: "Dungeon Floor",
        description: "Select the dungeon floor to check stats for.",
        options: ["1: Bonzo","2: Scarf","3: Professor","4: Thorn","5: Livid","6: Sadan","7: Necron / Wither King"],
        value: 0,
        subcategory: "Floor Settings"
    })
    .addSlider({
        category: "Party Finder",
        configName: "partyFinderminCata",
        title: "Cata Level",
        description: "Minimum Catacombs Level",
        options: [1, 55],
        value: 1,
        subcategory: "Requirements"
    })
    .addSlider({
        category: "Party Finder",
        configName: "partyFinderminClass",
        title: "Class Level",
        description: "Minimum Class Level",
        options: [1, 50],
        value: 1,
        subcategory: "Requirements"
    })
    .addSlider({
        category: "Party Finder",
        configName: "partyFinderminMP",
        title: "Magical Power",
        description: "Minimum Magical Power",
        options: [100, 2000],
        value: 100,
        subcategory: "Requirements"
    })
    .addSlider({
        category: "Party Finder",
        configName: "partyFinderminLvl",
        title: "Skyblock Level",
        description: "Minimum Skyblock Level",
        options: [1, 500],
        value: 1,
        subcategory: "Requirements"
    })
    .addDropDown({
        category: "Party Finder",
        configName: "partyFinderminPB",
        title: "Personal Best",
        description: "Minimum Personal Best",
        options: ["Sub 4:40","Sub 5:00","Sub 5:30","Sub 6:00","Custom"],
        value: 0,
        subcategory: "Requirements"
    })
    .addTextInput({
        category: "Party Finder",
        configName: "partyFindercustomMinPB",
        title: "Custom PB Time",
        description: "Custom personal best time in milliseconds.",
        subcategory: "Requirements",
    })
    .addTextInput({
        category: "Party Finder",
        configName: "partyFinderminSecrets",
        title: "Secret Count",
        description: "Minimum Secret Count",
        subcategory: "Requirements"
    })
    .addSwitch({
        category: "Slot Binding",
        configName: "slotBindingToggle",
        title: "&9Toggle Slot Binding",
        description: "Decides wether all features in Slot Binding are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Slot Binding Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Slot Binding",
        configName: "slotBindingPreset",
        title: "Preset",
        description: "The current preset in use. \nSelected preset will be edited with keybind.",
        options: ["Mage","Archer","Berserk","Healer","Tank","General","F7"],
        value: 0,
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Slot Binding",
        configName: "slotBindingautoSelect",
        title: "Auto Select",
        description: "&7Selects slot bind preset based on your selected class in dungeons.\n&cSelected preset will be used outside dungeons.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Bind Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Slot Binding",
        configName: "slotBindingswapSound",
        title: "Swap Sound",
        description: "Sound used for slot binding.",
        value: "note.pling",
        placeHolder: "note.pling",
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Slot Binding",
        configName: "slotBindingdynamicColoring",
        title: "Dynamic Coloring",
        description: "Changes the color of the line overlay based on the preset being used.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Dynamic GUI Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addColorPicker({
        category: "Slot Binding",
        configName: "slotBindingdefaultColor",
        title: "Default Color",
        description: "Changes the default Slot Binding Overlay Color.",
        value: [255, 255, 255, 255],
    })
    .addSwitch({
        category: "Auto Leap",
        configName: "autoLeapToggle",
        title: "&9Toggle Auto Leap",
        description: "Decides wether all features in Auto Leap are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Auto Leap",
        configName: "autoLeapWitherDoor",
        title: "Auto Leap to Door Opener",
        description: "Leaps to whoever opens the wither door.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap Wither Door Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Auto Leap",
        configName: "autoLeapi4",
        title: "Auto Leap after i4",
        description: "Leaps to specified ign after i4 is completed.\n&c[TODO: Command to change ign.]",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap I4 Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Auto Leap",
        configName: "autoLeapTarget",
        title: "I4 AutoLeap Target Class",
        description: "The Class to Leap to after I4 is Complete",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Auto Leap",
        configName: "autoLeaprelic",
        title: "Auto Leap after Relic",
        description: "Leaps to specified class after relic is picked.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap I4 Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Auto Leap",
        configName: "autoLeapRelicTarget",
        title: "Relic AutoLeap Target Class",
        description: "The Class to Leap to after relic is picked is Complete",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertToggle",
        title: "&9Toggle Alerts",
        description: "Decides wether all features in Auto Leap are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Alerts Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Alerts",
        configName: "alertSound",
        title: "Alert Sound",
        description: "Sound ID to be played on each alert",
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertAutoPet",
        title: "AutoPet Alert",
        description: "Displays a title when autopet triggers.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Pet Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertRag",
        title: "P5 Rag Axe Alert",
        description: "Displays a title when you should rag axe in drag phase.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Rag Axe Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertCamp",
        title: "Blood Camp Alert",
        description: "Displays a title when watcher is done spawning the first four mobs. Only works if you're mage.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Camp Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertDiamante",
        title: "Diamante Alert",
        description: "Displays a title if there is a diamante giant spawns.",
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Alerts",
        configName: "alertTact",
        title: "Tact Alert",
        description: "Displays a title at 3s timer, to help insta-clears.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Tact Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Alerts",
        configName: "invincibilityMsg",
        title: "Bonzo and Phoenix Messages",
        description: "Announces in chat when Bonzo and Phoenix proc.",
        subcategory: "Messages"
    })
    .addTextInput({
        category: "Alerts",
        configName: "maskText",
        title: "Bonzo Mask Text",
        description: "Text used for Bonzo Mask Message.",
        value: "Bonzo Gone",
        placeHolder: "Bonzo Gone",
        subcategory: "Messages"
    })
    .addTextInput({
        category: "Alerts",
        configName: "phoenixText",
        title: "Phoenix Text",
        description: "Text used for Phoenix Message.",
        value: "Phoenix Gone",
        placeHolder: "Phoenix Gone",
        subcategory: "Messages"
    })
    .addSwitch({
        category: "Alerts",
        configName: "pre4Disable",
        title: "Disable During Pre 4",
        description: "Does not send the bonzo and phoenix messages if you are doing pre 4 as berserker.",
        subcategory: "Messages"
    })
    .addSwitch({
        category: "Alerts",
        configName: "watcherMoveDisplay",
        title: "Watcher Move Alert",
        description: "Displays what time the watcher moves.",
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Location Messages",
        configName: "locationMessagesToggle",
        title: "&9Toggle Location Messages",
        description: "Decides wether all features in Location Messages are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Location Messages Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "locationNotif",
        title: "Alert Toggle",
        description: "Shows a title and plays a sound when a party member sends a location message",
        subcategory: "Location Title",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Location Messages Title ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Location Messages",
        configName: "locationSound",
        title: "Location Notification Sound",
        description: "Sound used for Location Notification Sound",
        value: "note.harp",
        placeHolder: "note.harp",
        subcategory: "Location Title",
        registerListener(previousvalue, newvalue) {
            mod_chat(`SS Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "ssCoord",
        title: "SS Nearby Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`SS Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "pre2Coord",
        title: "Pre Enter 2 Nearby Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Pre Enter 2 Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "i3Coord",
        title: "Insta 3 Nearby Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Insta 3 Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "pre3Coord",
        title: "Pre Enter 3 Nearby Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Pre Enter 3 Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "pre4Coord",
        title: "Pre Enter 4 Nearby Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Pre Enter 4 Nearby Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "slingshotCoord",
        title: "At Core Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`At Core Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Location Messages",
        configName: "tunnelCoord",
        title: "Inside Tunnel Message",
        subcategory: "Toggle",
        description: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Inside Tunnel Message ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Door Skip",
        configName: "doorSkipToggle",
        title: "&9Toggle Door Skip",
        description: "Decides wether all features in Door Skip are &aenabled&7/&cdisabled&7.",
    })
    .addSwitch({
        category: "Rat Protection",
        configName: "ratProtectionToggle",
        title: "Toggle",
        description: "Toggle Rat Protection",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Rat Protection Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSlider({
        category: "Rat Protection",
        subcategory: "",
        configName: "ratProtectionamount",
        title: "Rat Protection Amount",
        options: [1, 40],
        value: 20,
        description: ""
    })
    .addSwitch({
        category: "Rat Protection",
        configName: "ratProtectionoverlayEnabled",
        title: "Overlay",
        description: "Show overlay (this is only an approximation)",
        subcategory: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Rat Protection Overlay ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Auto Four",
        configName: "pre4Toggle",
        title: "&9Toggle Auto Four",
        description: "Decides wether all features in Auto Four are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Four ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }    
    })
    .addSlider({
        category: "Auto Four",
        configName: "smoothLookSteps",
        title: "Smooth Look Steps",
        options: [1, 10],
        value: 1,
        subcategory: "Settings",
        description: ""
    })
    .addSwitch({
        category: "Timers",
        configName: "timersToggle",
        title: "&9Toggle Timers",
        description: "Decides wether all features in Timers are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Timers Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Auto Relic",
        configName: "relicToggle",
        title: "&9Toggle Auto Relic",
        description: "Decides wether all features in Auto Relic are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Relic ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Auto Relic",
        configName: "relicTriggerbot",
        subcategory: "Place",
        title: "Triggerbot",
        description: "Automatically clicks on the right cauldron.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Relic Triggerbot ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Auto Relic",
        configName: "relicLook",
        title: "Toggle Relic Look",
        subcategory: "Relic Look",
        description: "Automatically rotates the player towards the right relic.\nDoesn't work for healer.\n\nFull auto for archer/bers.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Relic Look ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Auto Relic",
        configName: "smoothLookRelics",
        subcategory: "Relic Look",
        title: "Smooth Rotate",
        description: "Rotates smoothly towards target cauldron.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Relic Smooth Look ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Auto Relic",
        configName: "strafeMode",
        title: "Toggle Strafe Mode",
        subcategory: "Red/Orange",
        description: "Strafes towards relic, rather than just sprinting.\n&7About 2.04% faster.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Relic Strafe ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addTextInput({
        category: "Timers",
        configName: "relicspawnToggle",
        title: "Relic Spawn Timer",
        description: "Display a timer on your screen when relics are about to spawn",
        subcategory: "Relics",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Relic Timer ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addTextInput({
        category: "Timers",
        configName: "relicSpawnTimerAmt",
        title: "Relic Spawn Timer Amount",
        description: "Since relic spawn is so rng, choose your own time... \nDefault is 42",
        value: "42",
        placeHolder: "42",
        subcategory: "Relics"
    })
    .addSwitch({
        category: "Timers",
        configName: "crystalToggle",
        title: "Crystal Timer",
        description: "Displays a timer on your screen when crystals are about to spawn",
        subcategory: "Crystals",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Crystal Timer ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Timers",
        configName: "invincibilityToggle",
        title: "Invincibility Timer",
        description: "Displays a timer on your screen when invincibility procs.",
        subcategory: "Invincibility Timer",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Invincibility Timers ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Timers",
        configName: "invincibilityTimerAlert",
        title: "On-Screen Alert & Timer",
        description: "Displays a title on your screen when invincibility procs.",
        subcategory: "Invincibility Timer",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Invincibility Timers Title ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addTextInput({
        category: "Lowballing",
        configName: "purse",
        title: "Purse",
        description: "Purse for Lowball Message",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Lowballing ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        } 
    })
    .addSwitch({
        category: "Blood Helper",
        configName: "bloodHelperToggle",
        title: "&9Toggle Blood Helper",
        description: "Decides wether all features in Blood Helper are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Helper ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addColorPicker({
        category: "Blood Helper",
        configName: "bloodHelperColor",
        title: "Helper Color",
        value: [255, 255, 255, 255],
        subcategory: "Colors",
        description: ""
    })
    .addSwitch({
        category: "Blood Helper",
        configName: "bloodHelperDynamicColor",
        title: "Toggle Dynamic Color",
        description: "Automatically decides the color of your blood helper.",
        subcategory: "Colors",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Helper Color ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addColorPicker({
        category: "Blood Helper",
        configName: "bloodHelperInitialColor",
        title: "Initial Color",
        description: "",
        value: [255, 255, 255, 255],
        subcategory: "Colors"
    })
    .addColorPicker({
        category: "Blood Helper",
        configName: "bloodHelperSecondaryColor",
        title: "Secondary Color",
        value: [255, 255, 255, 255],
        subcategory: "Colors",
        description: "",
    })
    .addColorPicker({
        category: "Blood Helper",
        configName: "bloodHelperFinalColor",
        title: "Final Color",
        value: [255, 255, 255, 255],
        description: "",
        subcategory: "Colors"
    })
    .addSwitch({
        category: "Blood Helper",
        configName: "bloodTriggerbot",
        title: "Blood Triggerbot",
        description: "Automatically left clicks when the blood mob is about to spawn.",
        subcategory: "Triggerbot",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Triggerbot ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Blood Helper",
        configName: "bloodSwingCheck",
        title: "Delay",
        description: "Time on timer to swing at. (1-5)",
        subcategory: "Triggerbot",
    })
    .addSwitch({
        category: "Blood Helper",
        configName: "bloodAutoRotate",
        title: "Auto Rotate",
        description: "Automatically snaps to the mob spawn location.",
        subcategory: "Triggerbot",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Rotate ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Secrets",
        configName: "secretsToggle",
        title: "&9Toggle Secrets",
        description: "Decides wether all features in Secrets are &aenabled&7/&cdisabled&7.",
        subcategory: "",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Secrets Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Secrets",
        configName: "secretTriggerbot",
        title: "Secret Triggerbot",
        description: "Disables secret triggerbot",
        subcategory: "Triggerbot",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Secret Triggerbot ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSlider({
        category: "Secrets",
        configName: "secretDelay",
        title: "Secret Click Delay",
        description: "Delay between each right-click",
        options: [50, 500],
        value: 50,
        subcategory: "Triggerbot"
    })
    .addTextInput({
        category: "Secrets",
        configName: "secretClickSound",
        title: "Opened Sound",
        description: "Plays a sound after clicking!",
        subcategory: "Triggerbot"
    })
    .addSwitch({
        category: "Secrets",
        configName: "secretHighlightToggle",
        title: "Secret Highlight",
        description: "Renders an outline over clicked secrets.",
        subcategory: "Highlights",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Secret Highlight ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Secrets",
        configName: "secretHighlightText",
        title: "Highlight Text",
        description: "Shows text when you click on secrets.\n{text} Chest! | {text} Essence! | etc.",
        subcategory: "Highlights"
    })
    .addColorPicker({
        category: "Secrets",
        configName: "secretHighlightTextColor",
        title: "Secret Text Color",
        value: [255, 255, 255, 255],
        subcategory: "Highlights",
        description: ""
    })
    .addColorPicker({
        category: "Secrets",
        configName: "secretHighlightColor",
        title: "Secret Overlay Color",
        value: [255, 255, 255, 255],
        subcategory: "Highlights",
        description: ""
    })
    .addTextInput({
        category: "Secrets",
        configName: "secretHighlightDelay",
        title: "Highlight Delay",
        description: "Decides how long the overlay lasts.",
        subcategory: "Highlights",
    })
    .addSwitch({
        category: "Secrets",
        configName: "autoEtherToggle",
        title: "Toggle Auto Etherwarp",
        description: "Toggles auto-etherwarping",
        subcategory: "Auto Etherwarp",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Etherwarp Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Secrets",
        configName: "etherDing",
        title: "Toggle Sound",
        description: "Plays a ding each time rightclick procs",
        subcategory: "Auto Etherwarp",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Etherwarp Ding ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSlider({
        category: "Secrets",
        configName: "etherDelay",
        title: "Click Delay",
        description: "Delay between each right-click",
        options: [150, 500],
        value: 150,
        subcategory: "Auto Etherwarp"
    })
    .addTextInput({
        category: "Secrets",
        configName: "etherBlocks",
        title: "Blocks",
        description: "Block ID's of the block's to etherwarp to.",
        subcategory: "Auto Etherwarp"
    })
    .addColorPicker({
        category: "Secrets",
        configName: "autoEtherTextColor",
        title: "Etherwarp Text Color",
        value: [255, 255, 255, 255],
        subcategory: "Auto Etherwarp",
        description: ""
    })
    .addColorPicker({
        category: "Secrets",
        configName: "autoEtherColor",
        title: "Etherwarp Overlay Color",
        value: [255, 255, 255, 255],
        subcategory: "Auto Etherwarp",
        description: ""
    })
    .addSwitch({
        category: "Fast Leap",
        configName: "fastLeapToggle",
        title: "&9Toggle Fast Leap",
        description: "Decides wether all features in Fast Leap are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Fast Leap Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Fast Leap",
        configName: "leapGuiToggle",
        title: "Display Fast Leap GUI",
        description: "Displays text on your screen showing the selected leap target.",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Fast Leap Gui Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Fast Leap",
        configName: "leappchatToggle",
        title: "Party Chat Toggle",
        description: "Sends your leap message in party chat.\n&9Party &8> &6[MVP&0++&6] Ghostyy&f: Leaping to Core!",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Fast Leap chat Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Fast Leap",
        configName: "maxorEnd",
        title: "Maxor End",
        description: "Leaps to this class once Maxor phase ends.\nTrigger: &4[BOSS] Maxor&c: YOU TRICKED ME!",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Custom Targets"
    })
    .addDropDown({
        category: "Fast Leap",
        configName: "stormEnd",
        title: "Storm End",
        description: "Leaps to this class once Storm phase ends.\nTrigger: &4[BOSS] Storm&c: I should have known that I stood no chance.",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Custom Targets"
    })
    .addDropDown({
        category: "Fast Leap",
        configName: "goldorEnd",
        title: "Goldor End",
        description: "Leaps to this class once Goldor phase ends.\nTrigger: &4[BOSS] Necron&c: I'm afraid, your journey ends now.",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Custom Targets"
    })
    .addDropDown({
        category: "Fast Leap",
        configName: "necronEnd",
        title: "Necron End",
        description: "Leaps to this class once Necron phase ends.\nTrigger: &4[BOSS] Necron&c: ARGH!",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Custom Targets"
    })
    .addDropDown({
        category: "Fast Leap",
        configName: "relicPickup",
        title: "Relic Pickup",
        description: "Leaps to this class once Blue/Purple/Green Relic is picked up.\nTrigger: &6Ghostyy &apicked the &cCorrupted Blue Relic!",
        options: ["Mage","Archer","Berserk","Healer","Tank"],
        value: 0,
        subcategory: "Custom Targets"
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "dragPrioToggle",
        title: "&9Toggle Drag Prio",
        description: "Decides wether all features in Drag Prio are &aenabled&7/&cdisabled&7.",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Drag Prio Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "autoDBToggle",
        title: "&dAuto Last Breath",
        description: "Main Toggle for Auto Last Breath",
        subcategory: "Auto Debuff",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Debuff Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "autoLBsplit",
        title: "Only LB Split",
        description: "Only auto LB the split dragon)",
        subcategory: "Auto Debuff",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto LB Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "autoSpray",
        title: "&dAuto Jump Spray",
        description: "Main Toggle for Auto Jump Spray",
        subcategory: "Auto Debuff",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Spray Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "autoSpraySplit",
        title: "Only Spray Split",
        description: "Only auto jump spray the split dragon",
        subcategory: "Auto Debuff",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Only Spray Split Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Drag Prio",
        subcategory: "Drag Prio",
        configName: "spamLBdelay",
        title: "Spam LB Delay",
        subcategory: "Auto Debuff Timings",
        description: ""
    })
    .addTextInput({
        category: "Drag Prio",
        subcategory: "Drag Prio",
        configName: "jumpSprayDelay",
        title: "Jump Spray Delay",
        description: "4700-5000 recommended",
        subcategory: "Auto Debuff Timings"
    })
    .addTextInput({
        category: "Drag Prio",
        subcategory: "Drag Prio",
        configName: "randomFlux",
        title: "Random Fluctuation",
        description: "Set randomizer for the lb and spray delays, it will do +/- a random number from zero to this number",
        subcategory: "Auto Debuff Timings"
    })
    .addSlider({
        category: "Drag Prio",
        configName: "swapSlot",
        title: "Slot Swap",
        description: "0 is first slot. Auto Swaps to specified hotbar slot",
        options: [0, 7],
        value: 0,
        subcategory: "Auto Debuff"
    })
    .addSlider({
        category: "Drag Prio",
        configName: "splitPower",
        title: "Set Power",
        description: "Set the power that you split on",
        options: [0, 32],
        value: 0,
        subcategory: "Settings"
    })
    .addSlider({
        category: "Drag Prio",
        configName: "easyPower",
        title: "Set Easy Power",
        description: "Set the power that you split on for easy drags (O/P/G)",
        options: [0, 32],
        value: 0,
        subcategory: "Settings"
    })
    .addSwitch({
        category: "Drag Prio",
        configName: "showSingleDragons",
        title: "Show Non-Split drags",
        description: "Display \"X Dragon is spawning!\" on non-split drags",
        subcategory: "Settings",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Show Non Split Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Drag Prio",
        configName: "healerNormal",
        title: "Healer",
        description: "Set the team the healer will go with",
        options: ["Arch Team","Bers Team"],
        value: 0,
        subcategory: "Normal Teams"
    })
    .addDropDown({
        category: "Drag Prio",
        configName: "tankNormal",
        title: "Tank",
        description: "Set the team the tank will go with",
        options: ["Arch Team","Bers Team"],
        value: 0,
        subcategory: "Normal Teams"
    })
    .addDropDown({
        category: "Drag Prio",
        configName: "healerPurp",
        title: "Healer",
        description: "Set the team the healer will go with when purple",
        options: ["Arch Team","Bers Team"],
        value: 0,
        subcategory: "Purple Teams"
    })
    .addDropDown({
        category: "Drag Prio",
        configName: "tankPurp",
        title: "Tank",
        description: "Set the team the tank will go with when purple",
        options: ["Arch Team","Bers Team"],
        value: 0,
        subcategory: "Purple Teams"
    })
    .addSwitch({
        category: "Random",
        configName: "randomToggle",
        title: "&9Toggle Random Features",
        description: "Decides wether all features in Random are &aenabled&7/&cdisabled&7.",
        subcategory: ""
    })
    .addSwitch({
        category: "Random",
        configName: "chatEmotes",
        title: "Chat Emotes",
        description: "Allows you to use MVP++ emotes as any rank. ",
        subcategory: "Party Chat"
    })
    .addSwitch({
        category: "Random",
        configName: "cdKick",
        title: "Cooldown Kick Message",
        description: "Sends a message to the party when you are cooldown kicked.",
        subcategory: "Cooldown Kick Message"
    })
    .addTextInput({
        category: "Random",
        configName: "cdKickText",
        title: "Cooldown Kick Text",
        description: "Text used for Cooldown Kick Message.",
        value: "im kicked",
        placeHolder: "im kicked",
        subcategory: "Cooldown Kick Message"
    })
    .addSwitch({
        category: "Random",
        configName: "wardrobekeybinds",
        title: "Wardrobe Helper",
        description: "Works with mouse buttons.",
        subcategory: "Wardrobe Keybinds"
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlayToggle",
        title: "&9Toggle PF Overlay",
        description: "Shows the stats of players in party finder.",
        subcategory: ""
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlayMissingClasses",
        title: "Missing Classes",
        description: "Shows classes needed for a party in m4/m6/m7.",
        subcategory: "PF Overlay"
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlayClassLevel",
        title: "Show class level",
        description: "Shows the players class level in party finder.",
        subcategory: "PF Overlay"
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlaySecrets",
        title: "Show total secrets",
        description: "Shows the players total amount of secrets in party finder.",
        subcategory: "PF Overlay"
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlaySecretAverage",
        title: "Show secret average",
        description: "Shows the players secret average in party finder.",
        subcategory: "PF Overlay"
    })
    .addSwitch({
        category: "PF Overlay",
        configName: "pfOverlayPB",
        title: "Show S+ PB",
        description: "Shows the players fastest S+ time for the current floor in party finder.",
        subcategory: "PF Overlay"
    })
    .addSwitch({
        category: "Boss",
        configName: "bossToggle",
        title: "&9Toggle Boss Features",
        description: "Decides wether all features in Boss are &aenabled&7/&cdisabled&7.",
        subcategory: ""
    })
    .addSwitch({
        category: "Boss",
        configName: "leapAnnounce",
        title: "Leap Announce",
        description: "Says in party chat who you are leaping to.",
        subcategory: "Leap Message"
    })
    .addDropDown({
        category: "Boss",
        configName: "hideLeap",
        title: "Hide Leap Messages",
        description: "Hides leap messages when:",
        options: ["Never","Hide Own","Doesn\"t include self","Always"],
        value: 0,
        subcategory: "Leap Message"
    })
    .addSwitch({
        category: "Boss",
        configName: "terminalTimestamps",
        title: "Terminal Timestamps",
        description: "Shows what time each terminal, device, or lever was completed.",
        subcategory: "Terminals"
    })
    .addSwitch({
        category: "Boss",
        configName: "announceMelody",
        title: "Announce Melody",
        description: "Sends a message in Party Chat if you get the Melody Terminal.",
        subcategory: "Melody"
    })
    .addSwitch({
        category: "Boss",
        configName: "melodyProgress",
        title: "Announce Melody Progress",
        description: "Sends a message in Party Chat with the progress of your terminal.",
        subcategory: "Melody"
    })
    .addTextInput({
        category: "Boss",
        configName: "melodyText",
        title: "Announce Melody Text",
        description: "Text used for Announce Melody.",
        value: "null",
        placeHolder: "null",
        subcategory: "Melody"
    })
    .addSwitch({
        category: "Boss",
        configName: "relicTimer",
        title: "Relic Timer",
        description: "Shows time it took to place your relic.",
        subcategory: "Relics"
    })
    .addSwitch({
        category: "Boss",
        configName: "relicPickupTime",
        title: "Show Relic Pick Up Time",
        description: "Calculates how long it took to pick up the relic after it spawned.",
        subcategory: "Relics"
    })
    .addSwitch({
        category: "Boss",
        configName: "showEveryRelic",
        title: "Show Every Relic",
        description: "Shows relic time for all five relics (might clog chat).",
        subcategory: "Relics"
    })
    .addDropDown({
        category: "Boss",
        configName: "melodyColor",
        title: "Text Color",
        description: "",
        options: ["Dark Red","Red","Gold","Yellow","Dark Green","Green","Aqua","Dark Aura","Dark Blue","Blue","Light Purple","Dark Purple","White","Gray","Dark Gray","Black"],
        value: 0,
        subcategory: "Melody Warning"
    })
    .addSwitch({
        category: "Boss",
        configName: "melodyWarningEnabled",
        title: "Toggle",
        description: "Warns you when someone has Melody and tells you their progress.",
        subcategory: "Melody Warning"
    })
    .addSlider({
        category: "Boss",
        configName: "melodyWarningScale",
        title: "Scale",
        description: "",
        options: [0.25, 4],
        value: 0.25,
        subcategory: "Melody Warning"
    })
    .addDropDown({
        category: "Boss",
        configName: "melodyWarningSound",
        title: "Sound",
        description: "",
        options: ["note.pling","mob.blaze.hit","fire.ignite","random.orb"],
        value: 0,
        subcategory: "Melody Warning"
    })
    .addSlider({
        category: "Boss",
        configName: "melodyWarningPitch",
        title: "Sound Pitch",
        description: "",
        options: [0.5, 2],
        value: 0.5,
        subcategory: "Melody Warning"
    })
    .addTextInput({
        category: "Boss",
        configName: "Messages",
        title: "Messages",
        description: "/melodywarning to configure. This lets it display 0/4.",
        value: "",
        placeHolder: "",
        subcategory: "Melody Warning"
    })
    
const config = new Settings("GhostAddons", defConfig, "templates/colorScheme.json", "§5Ghost Addons §7by §6Ghostyy§7 and §6KingisBad")
.setPos(10, 10)
.setSize(80, 80)
.apply()
.setCommand("gh", ["ghost", "ghostaddons", "kg"])
.onCloseGui(() => {
    data.recently_closed = true
    data.save()
})
export default () => config.settings