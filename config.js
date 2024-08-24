import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
import { mod_chat } from "./utils/utils"
import { title } from "../BloomCore/utils/Utils"

const defConfig = new DefaultConfig("GhostAddons", "data/config.json")

defConfig
    // General Category
    .addSwitch({
        category: "General",
        title: "&5&lToggle Ghost Addons",
        description: "Decides whether all features of this mod are &aenabled&7/&cdisabled&7.",
        configName: "toggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Main Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "General",
        title: "Debug Mode",
        description: "Debug stuff, ignore this.",
        configName: "debug",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Debug Mode ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "General",
        subcategory: "Cheater",
        title: "&4&lToggle Cheats",
        description: "Decides whether all &4Cheat&7 features of this mod are &aenabled&7/&cdisabled&7.",
        configName: "cheatToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Cheat Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    // Party Finder Category
    .addSwitch({
        category: "Party Finder",
        title: "&9Toggle Party Finder",
        description: "Decides whether the Party Finder Module is &aenabled&7/&cdisabled&",
        configName: "partyFinderToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Party Finder",
        title: "&9Toggle Auto kick",
        description: "Decides whether auto kick is &aenabled&7/&cdisabled&7",
        configName: "partyFinderAutoKick",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Auto Kick ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Party Finder",
        title: "Party Chat Messages",
        description: "Sends a message in party chat when a user joins through party finder.",
        configName: "partyFinderPartyChat",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Party Finder Party Chat ${newvalue ? "&aEnabled" : "&cDisabled"}`)
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

    .addDropDown({
        category: "Party Finder",
        subcategory: 'Floor Settings',
        title: "Dungeon Type",
        description: "Decides which dungeon type to use for party finder.",
        configName: "partyFinderDungeonType",
        options:  ['Catacombs', 'Master Catacombs'],
        value: 1
    })

    .addDropDown({
        category: "Party Finder",
        subcategory: 'Floor Settings',
        title: "Dungeon Floor",
        description: "Decides which dungeon floor to use for party finder.",
        configName: "partyFinderDungeonFloor",
        options: ['1: Bonzo', '2: Scarf', '3: Professor', '4: Thorn', '5: Livid', '6: Sadan', '7: Necron / Wither King'],
        value: 6
    })

    .addSlider({
        category: "Party Finder",
        subcategory: 'Requirements',
        title: "Catacombs Level",
        description: "Sets the minimum level required to join the party finder for Catacombs.",
        configName: "partyFinderminCata",
        options: [1, 100],
        value: 50
    })

    .addSlider({
        category: "Party Finder",
        subcategory: 'Requirements',
        title: "Magical Power",
        description: "Sets the minimum mp required to join the party finder for Catacombs.",
        configName: "partyFinderminMP",
        options: [100, 2000],
        value: 1350
    })

    .addSlider({
        category: "Party Finder",
        subcategory: 'Requirements',
        title: "Skyblock Level",
        description: "Sets the minimum sb level required to join the party finder for Catacombs.",
        configName: "partyFinderminLvl",
        options: [1, 500],
        value: 250
    })

    .addDropDown({
        category: "Party Finder",
        subcategory: 'Requirements',
        title: "Personal Best",
        description: "Sets the minimum personal best required to join the party finder for Catacombs.",
        configName: "partyFinderminPB",
        options: ['Sub 4:40', 'Sub 5:00', 'Sub 5:30', 'Sub 6:00', 'Custom'],
        value: 2
    })

    .addTextInput({
        category: "Party Finder",
        subcategory: "Requirements",
        title: "Custom Personal Best",
        description: "Enter a custom personal best time in miliseconds",
        configName: "partyFindercustomMinPB",
        value: "",
        placeholder: "Enter PB..."
    })
    
    .addTextInput({
        category: "Party Finder",
        subcategory: "Requirements",
        title: "Secret Count",
        description: "Enter the secret count required to join the party finder for Catacombs",
        configName: "partyFinderminSecrets",
        value: "",
        placeholder: "Enter Secrets..."
    })

    .addColorPicker({
        category: "Party Finder",
        subcategory: "Stats Command",
        title: "Menu Background",
        description: "Sets the color of the menu background",
        configName: "m7StatsBackgroundColor",
        value: [0, 0, 0, 127]
    })

    // Slot Binding
    .addSwitch({
        category: "Slot Binding",
        title: "&9Toggle Slot Binding",
        description: "Decides whether the Slot Binding Module is &aenabled&7/&cdisabled&",
        configName: "slotBindingToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Slot Binding Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addColorPicker({
        category: "Slot Binding",
        subcategory: "Colors",
        title: "Slot Binding Color",
        description: "Sets the color of the default slot binding GUI",
        configName: "slotBindingdefaultColor",
        value: [255, 0, 0, 255]
    })

    .addDropDown({
        category: "Slot Binding",
        subcategory: "Settings",
        title: "Preset",
        description: "The current preset in use. \nSelected preset will be edited with keybind.",
        configName: "slotBindingPreset",
        options: ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank', 'General'],
        value: 0
    })

    .addSwitch({
        category: "Slot Binding",
        subcategory: "Settings",
        title: "Toggle Auto Bind",
        description: "Automatically selects a preset based on your dungeon class.",
        configName: "slotBindingautoSelect",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Bind Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addTextInput({
        category: "Slot Binding",
        subcategory: "Settings",
        title: "Swap Sound",
        description: "The sound that will be played when swapping items",
        configName: "slotBindingswapSound",
        value: "note.pling",
        placeholder: "Enter Sound ID..."
    })

    .addSwitch({
        category: "Slot Binding",
        subcategory: "Settings",
        title: "Dymanic GUI Coloring",
        description: "Changes the color of the GUI based on the current preset",
        configName: "slotBindingdynamicColoring",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Dynamic GUI Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    // Auto Leap Category
    .addSwitch({
        category: "Auto Leap",
        title: "&9Auto Leap Toggle",
        description: "Decides whether all features of the Auto Leap Module are &aenabled&7/&cdisabled&7.",
        configName: "autoLeapToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Auto Leap",
        subcategory: "Wither Door",
        title: "Door Opener",
        description: "Automatically leaps to the door opener.",
        configName: "autoLeapWitherDoor",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap Wither Door Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Auto Leap",
        subcategory: "I4",
        title: "Insta Arrows Device",
        description: "Automatically leaps to a class after Insta Arrows Device.",
        configName: "autoLeapi4",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Leap I4 Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addDropDown({
        category: "Auto Leap",
        subcategory: "I4",
        title: "Insta Arrows Device Class",
        description: "Select the class to leap to after Insta Arrows Device.",
        configName: "autoLeapTarget",
        options: ['Mage', 'Archer', 'Berserk', 'Healer', 'Tank'],
        value: 0
    })

    // Alerts Category
    .addSwitch({
        category: "Alerts",
        title: "&9Alerts Toggle",
        description: "Decides whether all features of the Alerts Module are &aenabled&7/&cdisabled&7.",
        configName: "alertToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Alerts Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addTextInput({
        category: "Alerts",
        subcategory: "Sounds",
        title: "Alerts Sound",
        description: "The sound that plays when an alert is triggered.",
        configName: "alertSound",
        value: "note.pling",
        placeholder: "Enter Sound ID..."
    })

    .addSwitch({
        category: "Alerts",
        subcategory: "Toggles",
        title: "Auto Pet",
        description: "Displays a title when an auto-pet rule proc's",
        configName: "alertAutoPet",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Auto Pet Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Alerts",
        subcategory: "Toggles",
        title: "Ragnarock Axe",
        description: "Displays a title when Ragnarock Axe is meant to be triggered.",
        configName: "alertRag",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Rag Axe Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Alerts",
        subcategory: "Toggles",
        title: "Blood Camp",
        description: "Displays a title when Blood Camp is meant to be cleared.",
        configName: "alertCamp",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Blood Camp Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    .addSwitch({
        category: "Alerts",
        subcategory: "Toggles",
        title: "Tactical Insertion",
        description: "Displays a title when Tactical Insertion is meant to be triggered.",
        configName: "alertTact",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Tact Alert Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    
    // Location Messages
    .addSwitch({
        category: "Location Messages",
        title: "&9Toggle Location Messages",
        description: "Decides wether all features in Location Messages are &aenabled&7/&cdisabled&7.",
        configName: "locationMessagesToggle",
        registerListener(previousvalue, newvalue) {
            mod_chat(`Location Messages Toggle ${newvalue ? "&aEnabled" : "&cDisabled"}`)
        }
    })

    

const config = new Settings("GhostAddons", defConfig, "data/ColorScheme.json", "Ghost Addons")
.setPos(10, 10)
.setSize(80, 80)
.apply()
.setCommand("gh", ["ghost", "ghostaddons"])

export default () => config.settings