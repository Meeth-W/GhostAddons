import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @DecimalSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty
} from '../Vigilance/index';

@Vigilant('GhostAddons', 'Ghost Addons', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', 'Slot Binding', 'Party Finder', 'Auto Leap'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);

        // General Section
        this.setCategoryDescription('General', '&6Ghost Addons\n\n&bCoded by: &cGhostyy &7(.ghxstyy)')

        // Party Finder
        this.setCategoryDescription('Party Finder', '&6Party Finder Settings\n\n&7/nicepb {user} | /m7stats {user}')

        // Slot Binding
        this.setCategoryDescription('Slot Binding', '&6Slot Binding Settings\n\n&7Set hotkey from Minecraft Controls Settings.')

        // Auto Leap 
        this.setCategoryDescription('Auto Leap', '&6Automatically leaps to certain users on specific events.\n\n&4This module is a Cheat. Use at your own risk.')
    }
    
    // General
    @SwitchProperty({
        name: 'Toggle Ghost Addons',
        description: 'Decides whether all features of this mod are &aenabled&7/&cdisabled&7.',
        category: 'General'
    })
    toggle = false;

    @SwitchProperty({
        name: 'Debug Mode',
        description: 'Debug stuff, ignore this.',
        category: 'General'
    })
    debug = false;

    // Party Finder
    @SwitchProperty({
        name: '&9Toggle Party Finder',
        description: 'Decides wether all features in Party Finder are &aenabled&7/&cdisabled&7.',
        category: 'Party Finder'
    })
    partyFinderToggle = false;

    @SwitchProperty({
        name: '&9Toggle Auto Kick',
        description: 'Decides wether players are automatically kicked from the party.',
        category: 'Party Finder'
    })
    partyFinderAutoKick = false;

    @SwitchProperty({
        name: 'Party Chat',
        description: 'Send an overview / kick message in party chat.',
        category: 'Party Finder'
    })
    partyFinderPartyChat = false;

    @SelectorProperty({
        name: 'Dungeon Type',
        description: 'Select the floor type to check stats for.',
        category: 'Party Finder',
        subcategory: 'Floor Settings',
        options: ['Catacombs', 'Master Catacombs']
    })
    partyFinderDungeonType = 1;

    @SelectorProperty({
        name: 'Dungeon Floor',
        description: 'Select the dungeon floor to check stats for.',
        category: 'Party Finder',
        subcategory: 'Floor Settings',
        options: ['1: Bonzo', '2: Scarf', '3: Professor', '4: Thorn', '5: Livid', '6: Sadan', '7: Necron / Wither King']
    })
    partyFinderDungeonFloor = 6;

    @SliderProperty({
        name: 'Cata Level',
        description: 'Minimum Catacombs Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 100,
        step: 1
    })
    partyFinderminCata = 50;

    @SliderProperty({
        name: 'Class Level',
        description: 'Minimum Class Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 50,
        step: 1
    })
    partyFinderminClass = 45;

    @SliderProperty({
        name: 'Magical Power',
        description: 'Minimum Magical Power',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 100,
        max: 2000,
        step: 1
    })
    partyFinderminMP = 1450;

    @SliderProperty({
        name: 'Skyblock Level',
        description: 'Minimum Skyblock Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 500,
        step: 1
    })
    partyFinderminLvl = 300;

    @SelectorProperty({
        name: 'Personal Best',
        description: 'Minimum Personal Best',
        category: 'Party Finder',
        subcategory: 'Requirements',
        options: ['Sub 4:40', 'Sub 5:00', 'Sub 5:30', 'Sub 6:00', 'Custom']
    })
    partyFinderminPB = 0;

    @TextProperty({
        name: 'Custom PB Time',
        description: 'Custom personal best time in milliseconds.',
        category: 'Party Finder',
        subcategory: 'Requirements'
    })
    partyFindercustomMinPB = "300000";
    
    @TextProperty({ 
        name: 'Secret Count',
        description: 'Minimum Secret Count',
        category: 'Party Finder',
        subcategory: 'Requirements'
    })
    partyFinderminSecrets = "50000";

    // Slot Binding
    @SwitchProperty({
        name: '&9Toggle Slot Binding',
        description: 'Decides wether all features in Slot Binding are &aenabled&7/&cdisabled&7.',
        category: 'Slot Binding'
    })
    slotBindingToggle = false;

    @SelectorProperty({
        name: 'Preset',
        description: 'The current preset in use. \nSelected preset will be edited with keybind.',
        category: 'Slot Binding',
        subcategory: 'Settings',
        options: ['Mage', 'Archer', 'Berserker', 'Healer', 'Tank', 'General'],
    })
    slotBindingPreset = 0;

    @SwitchProperty({
        name: "Auto Select",
        description: "&7Selects slot bind preset based on your selected class in dungeons.\n&cSelected preset will be used outside dungeons.",
        category: "Slot Binding",
        subcategory: 'Settings'
    })
    slotBindingautoSelect = false

    @TextProperty({
        name: "Swap Sound",
        description: "Sound used for slot binding.",
        category: "Slot Binding",
        placeholder: "note.pling",
        subcategory: 'Settings'
    })
    slotBindingswapSound = "note.pling";

    @SwitchProperty({
        name: "Dynamic Coloring",
        description: "Changes the color of the line overlay based on the preset being used.",
        category: "Slot Binding",
        subcategory: 'Settings'
    })
    slotBindingdynamicColoring = false

    // Auto Leap 
    @SwitchProperty({
        name: '&9Toggle Auto Leap',
        description: 'Decides wether all features in Auto Leap are &aenabled&7/&cdisabled&7.',
        category: 'Auto Leap'
    })
    autoLeapToggle = false;

    @SwitchProperty({
        name: 'Auto Leap to Door Opener',
        description: 'Leaps to whoever opens the wither door.',
        category: 'Auto Leap',
        subcategory: 'Settings'
    })
    autoLeapWitherDoor = false;

    @SwitchProperty({
        name: 'Auto Leap after i4',
        description: 'Leaps to specified ign after i4 is completed.\n&c[TODO: Command to change ign.]',
        category: 'Auto Leap',
        subcategory: 'Settings'
    })
    autoLeapi4 = false;

    @TextProperty({
        name: "Leap Target",
        description: "Default person to leap to.",
        category: "Auto Leap",
        placeholder: "Ghostyy",
        subcategory: 'Settings'
    })
    autoLeapTarget = "Ghostyy";
}

export default new Settings();