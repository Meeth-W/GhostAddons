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
        const categories = ['General', 'Slot Binding', 'Party Finder', 'Blood Helper', 'Timers', 'Auto Leap', 'Secrets', 'Door Skip', 'Alerts', 'Location Messages', 'Rat Protection', 'Auto Four', 'Lowballing'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {

    relicSpawnTimerGui = new Gui()
    dragonSpawnTimerGui = new Gui()
    crystalSpawnTimerGui = new Gui()
    invincibilityTimerGui = new Gui()

    constructor() {
        this.initialize(this);

        // General Section
        this.setCategoryDescription('General', '&6Ghost Addons\n\n&bCoded by: &cGhostyy &7(.ghxstyy)')

        // Party Finder
        this.setCategoryDescription('Party Finder', '&6Party Finder Settings\n\n&7/nicepb {user} | /m7stats {user}')

        // Slot Binding
        this.setCategoryDescription('Slot Binding', '&6Slot Binding Settings\n\n&7Set hotkey from Minecraft Controls Settings.')

        // Blood Helper
        this.setCategoryDescription('Blood Helper', '&6Blood Camp Helper.\n\n&7Auto Camp is still a WIP. Misses mobs if server lags.')

        // Auto Leap 
        this.setCategoryDescription('Auto Leap', '&6Automatically leaps to certain users on specific events.\n\n&4This module is a Cheat. Use at your own risk.')

        // Alerts
        this.setCategoryDescription('Alerts', '&6Displays titles at certain stages of the game.\n\n&7TODO: Command to change colors.')

        // Secrets
        this.setCategoryDescription('Secrets', '&6Secrets Utils.\n\n&4This Module Contains Cheats.')

        // Location Messages
        this.setCategoryDescription('Location Messages', '&6Sends messages in party chat when you reach a certain set of coords in p3.')

        // Doorless
        this.setCategoryDescription('Door Skip', '&6Modified version of Doorless by soshimee.\n\n&4This module is a Cheat. Use at your own risk.')

        // Rat Protection
        this.setCategoryDescription('Rat Protection', '&6Prevents you getting logged out from another location.')

        // Auto Pre 4
        this.setCategoryDescription('Auto Four', '&6Automatically does the fourth device for you.')

        // Timers
        this.setCategoryDescription('Timers', '&6Tick accurate timers. Displayed at specific events.')

        // Lowballing
        this.setCategoryDescription('Lowballing', '&6Lowballing stuff.\n\nSetup keybind for lowballing messages in settings.')
    }
    
    // General
    @SwitchProperty({
        name: '&5&lToggle Ghost Addons',
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

    // @SwitchProperty({
    //     name: '&9Toggle Stats Command',
    //     description: 'Decides wether the &4/m7stats&7 command is &aenabled&7/&cdisabled&7.',
    //     category: 'Party Finder'
    // })
    // m7StatsToggle = false;

    @SwitchProperty({
        name: '&9Toggle Auto Kick',
        description: 'Decides wether players are automatically kicked from the party.',
        category: 'Party Finder'
    })
    partyFinderAutoKick = false;

    @ColorProperty({
		name: "Stats Menu Background Color",
		category: "Party Finder"
	})
	m7StatsBackgroundColor = new Color(Renderer.color(0, 0, 0, 127), true);

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

    @ColorProperty({
		name: "Default Color",
		category: "Slot Binding",
        description: "Changes the default Slot Binding Overlay Color."
	})
	slotBindingdefaultColor = new Color(Renderer.color(0, 0, 0, 127), true);

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

    // Alerts 
    @SwitchProperty({
        name: "&9Toggle Alerts",
        description: "Decides wether all features in Auto Leap are &aenabled&7/&cdisabled&7.",
        category: "Alerts"
    })
    alertToggle = false

	@TextProperty({
        name: 'Alert Sound',
        description: "Sound ID to be played on each alert",
        category: 'Alerts',
		subcategory: "Settings"
    })
    alertSound = "note.pling";

	@SwitchProperty({
        name: "AutoPet Alert",
        description: "Displays a title when autopet triggers.",
        category: "Alerts",
        subcategory: "Settings"
    })
    alertAutoPet = false

	@SwitchProperty({
        name: "P5 Rag Axe Alert",
        description: "Displays a title when you should rag axe in drag phase.",
        category: "Alerts",
        subcategory: "Settings"
    })
    alertRag = false

	@SwitchProperty({
        name: "Blood Camp Alert",
        description: "Displays a title when watcher is done spawning the first four mobs. Only works if you're mage.",
        category: "Alerts",
        subcategory: "Settings"
    })
    alertCamp = false

	@SwitchProperty({
        name: "Tact Alert",
        description: "Displays a title at 3s timer, to help insta-clears.",
        category: "Alerts",
        subcategory: "Settings"
    })
    alertTact = false

    // Location Messages
    @SwitchProperty({
        name: "&9Toggle Location Messages",
        description: "Decides wether all features in Location Messages are &aenabled&7/&cdisabled&7.",
        category: "Location Messages"
    })
    locationMessagesToggle = false

    @SwitchProperty({
        name: "Alert Toggle",
        description: "Shows a title and plays a sound when a party member sends a location message",
        category: "Location Messages",
        subcategory: "Location Title"
    })
    locationNotif = false;

    @TextProperty({
        name: "Location Notification Sound",
        description: "Sound used for Location Notification Sound",
        category: "Location Messages",
        subcategory: "Location Title",
        placeholder: "note.harp"
    })
    locationSound = "note.harp";

    @SwitchProperty({
        name: "SS Nearby Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    ssCoord = false;

    @SwitchProperty({
        name: "Pre Enter 2 Nearby Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    pre2Coord = false;

    @SwitchProperty({
        name: "Insta 3 Nearby Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    i3Coord = false;

    @SwitchProperty({
        name: "Pre Enter 3 Nearby Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    pre3Coord = false;
    
    @SwitchProperty({
        name: "Pre Enter 4 Nearby Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    pre4Coord = false;

    @SwitchProperty({
        name: "At Core Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    slingshotCoord = false;

    @SwitchProperty({
        name: "Inside Tunnel Message",
        category: "Location Messages",
        subcategory: "Toggles"
    })
    tunnelCoord = false;

    // Door Skip
    @SwitchProperty({
        name: "&9Toggle Door Skip",
        description: "Decides wether all features in Door Skip are &aenabled&7/&cdisabled&7.",
        category: "Door Skip"
    })
    doorSkipToggle = false

    // Rat Prot
    @SwitchProperty({
		name: "Toggle",
		description: "Toggle Rat Protection",
		category: "Rat Protection"
	})
	ratProtectionToggle = false;

	@NumberProperty({
		name: "Amount",
		category: "Rat Protection",
		min: 1,
		max: 40
	})
	ratProtectionamount = 20;

	@SwitchProperty({
		name: "Overlay",
		description: "Show overlay (this is only an approximation)",
		category: "Rat Protection"
	})
	ratProtectionoverlayEnabled = false;

    // Auto 4
    @SwitchProperty({
        name: "&9Toggle Auto Four",
        description: "Decides wether all features in Auto Four are &aenabled&7/&cdisabled&7.",
        category: "Auto Four"
    })
    autoFourToggle = false

    // @SwitchProperty({ Coming Soon TM
    //     name: "Smooth Look",
    //     description: "Turns off snapping in auto four. Rotates smoothly over 150 ms.",
    //     category: "Auto Four",
    //     subcategory: "Settings"
    // })
    // autoFourSmooth = false

    // Spawn Timers
    @SwitchProperty({
        name: "&9Toggle Timers",
        description: "Decides wether all features in Timers are &aenabled&7/&cdisabled&7.",
        category: "Timers"
    })
    timersToggle = false

    @SwitchProperty({
        name: "Relic Timer",
        description: "Displays a timer on your screen when relic is about to spawn",
        category: "Timers",
        subcategory: "Relics",
    })
    relicToggle = false

    @TextProperty({
        name: "Relic Spawn Timer Amount",
        description: "Since relic spawn is so rng, choose your own time... \nDefault is 42",
        category: "Timers",
        subcategory: "Relics",
        placeholder: "42"
    })
    relicSpawnTimerAmt = "42"

    @ButtonProperty({
        name: "Move Relic Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "Timers",
        subcategory: "Relics",
        placeholder: "Move"
    })
    MoveRelicSpawnTimerGui() {
        this.relicSpawnTimerGui.open()
    };

    @SwitchProperty({
        name: "Crystal Timer",
        description: "Displays a timer on your screen when crystals are about to spawn",
        category: "Timers",
        subcategory: "Crystals",
    })
    crystalToggle = false

    @ButtonProperty({
        name: "Move Crystal Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "Timers",
        subcategory: "Crystals",
        placeholder: "Move"
    })
    MoveCrystalSpawnTimerGui() {
        this.crystalSpawnTimerGui.open()
    };

    @SwitchProperty({
        name: "Drag Timer",
        description: "Displays a timer on your screen when a dragon is about to spawn.\nHas Built-In Drag Prio.",
        category: "Timers",
        subcategory: "Dragon Timer",
    })
    dragToggle = false

    @ButtonProperty({
        name: "Move Dragon Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "Timers",
        subcategory: "Dragon Timer",
        placeholder: "Move"
    })
    MoveDragonSpawnTimerGui() {
        this.dragonSpawnTimerGui.open()
    };

    @SwitchProperty({
        name: "Invincibility Timer",
        description: "Displays a timer on your screen when invincibility procs.",
        category: "Timers",
        subcategory: "Invincibility Timer",
    })
    invincibilityToggle = false

    @ButtonProperty({
        name: "Move Invincibility Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "Timers",
        subcategory: "Invincibility Timer",
        placeholder: "Move"
    })
    MoveInvincibilityTimerGui() {
        this.invincibilityTimerGui.open()
    };

    @TextProperty({
        name: 'Purse',
        description: 'Purse for Lowball Message',
        category: 'Lowballing'
    })
    purse = "1b";

    @SwitchProperty({
        name: "&9Toggle Blood Helper",
        description: "Decides wether all features in Blood Helper are &aenabled&7/&cdisabled&7.",
        category: "Blood Helper"
    })
    bloodHelperToggle = false

    @ColorProperty({
		name: "Helper Color",
		category: "Blood Helper"
	})
	bloodHelperColor = new Color(Renderer.color(0, 0, 255, 255), true);

    @SwitchProperty({
        name: "Blood Triggerbot",
        description: "Automatically left clicks when the blood mob is about to spawn.",
        category: "Blood Helper",
        subcategory: 'Triggerbot'
    })
    bloodTriggerbot = false

    @TextProperty({
        name: 'Delay',
        description: 'Time on timer to swing at. (0.1-0.5)',
        category: 'Blood Helper',
        subcategory: 'Triggerbot'
    })
    bloodSwingCheck = "0.5";

    @SwitchProperty({
        name: "Auto Rotate",
        description: "Automatically snaps to the mob spawn location.",
        category: "Blood Helper",
        subcategory: 'Triggerbot'
    })
    bloodAutoRotate = false;

    // Secrets
    @SwitchProperty({
        name: "&9Toggle Secrets",
        description: "Decides wether all features in Secrets are &aenabled&7/&cdisabled&7.",
        category: "Secrets"
    })
    secretsToggle = false;

    @SwitchProperty({
        name: "Secret Highlight",
        description: "Renders an outline over clicked secrets.",
        category: "Secrets",
        subcategory: "Highlights"
    })
    secretHighlightToggle = false;

    @TextProperty({
        name: 'Highlight Text',
        description: 'Shows text when you click on secrets.\n{text} Chest! | {text} Essence! | etc.',
        category: 'Secrets',
        subcategory: 'Highlights'
    })
    secretHighlightText = "Clicked";

    @ColorProperty({
		name: "Text Color",
		category: "Secrets",
        subcategory: "Highlights"
	})
	secretHighlightTextColor = new Color(Renderer.color(0, 0, 0, 127), true);

    @ColorProperty({
        name: "Overlay Color",
        category: "Secrets",
        subcategory: "Highlights"
    })
    secretHighlightColor = Color.BLUE;

    @TextProperty({
        name: 'Delay',
        description: 'Decides how long the overlay lasts.',
        category: 'Secrets',
        subcategory: 'Highlights'
    })
    secretHighlightDelay = "3000";

    @SwitchProperty({
        name: 'Toggle Auto Etherwarp',
        description: 'Toggles auto-etherwarping',
        category: 'Secrets',
        subcategory: 'Auto Etherwarp',
    })
    autoEtherToggle = false

    @SwitchProperty({
        name: 'Toggle Sound',
        description: 'Plays a ding each time rightclick procs',
        category: 'Secrets',
        subcategory: 'Auto Etherwarp',
    })
    etherDing = false

    @SliderProperty({
        name: 'Click Delay',
        description: 'Delay between each right-click',
        category: 'Secrets',
        subcategory: 'Auto Etherwarp',
        min: 150,
        max: 500,
        step: 10,
    })
    etherDelay = 150;

    @TextProperty({
        name: 'Blocks',
        description: "Block ID's of the block's to etherwarp to.",
        category: 'Secrets',
        subcategory: 'Auto Etherwarp'
    })
    etherBlocks = "emerald_block, lapis_block";

    @ColorProperty({
		name: "Text Color",
		category: "Secrets",
        subcategory: "Auto Etherwarp"
	})
	autoEtherTextColor = new Color(Renderer.color(0, 0, 0, 127), true);

    @ColorProperty({
        name: "Overlay Color",
        category: "Secrets",
        subcategory: "Auto Etherwarp"
    })
    autoEtherColor = Color.BLUE;
}

export default new Settings();