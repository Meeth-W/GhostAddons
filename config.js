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
        const categories = ['General'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    // General
    @SwitchProperty({
        name: 'Toggle Ghost Addons',
        description: 'Decides whether all features of this mod are &aenabled&7/&cdisabled&7.',
        category: 'General'
    })
    toggle = false

    // Party Finder
    // @TextProperty({
    //     name: 'API Key',
    //     description: 'Your API Key &chttps://developer.hypixel.net/dashboard',
    //     category: 'Party FInder',
    //     subcategory: 'API Settings'
    // })
    // apiKey = "null";

    @SwitchProperty({
        name: '&9Toggle Party Finder',
        description: 'Decides wether all features in Party Finder are &aenabled&7/&cdisabled&7.',
        category: 'Party Finder'
    })
    partyFinderToggle = false

    @SwitchProperty({
        name: '&9Toggle Auto Kick',
        description: 'Decides wether players are automatically kicked from the party.',
        category: 'Party Finder'
    })
    partyFinderAutoKick = false

    @SwitchProperty({
        name: 'Party Chat',
        description: 'Send an overview / kick message in party chat.',
        category: 'Party Finder'
    })
    partyFinderPartyChat = false

    @SelectorProperty({
        name: 'Dungeon Type',
        description: 'Select the floor type to check stats for.',
        category: 'Party Finder',
        subcategory: 'Floor Settings',
        options: ['Catacombs', 'Master Catacombs']
    })
    partyFinderDungeonType = 1

    @SelectorProperty({
        name: 'Dungeon Floor',
        description: 'Select the dungeon floor to check stats for.',
        category: 'Party Finder',
        subcategory: 'Floor Settings',
        options: ['1: Bonzo', '2: Scarf', '3: Professor', '4: Thorn', '5: Livid', '6: Sadan', '7: Necron / Wither King']
    })
    partyFinderDungeonFloor = 6

    @SliderProperty({
        name: 'Cata Level',
        description: 'Minimum Catacombs Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 100,
        step: 1,
    })
    partyFinderminCata = 50;

    // Class Level
    @SliderProperty({
        name: 'Class Level',
        description: 'Minimum Class Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 50,
        step: 1,
    })
    partyFinderminClass = 45;

    // MP
    @SliderProperty({
        name: 'Magical Power',
        description: 'Minimum Magical Power',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 100,
        max: 2000,
        step: 1,
    })
    partyFinderminMP = 1450;

    // SB Level
    @SliderProperty({
        name: 'Skyblock Level',
        description: 'Minimum Skyblock Level',
        category: 'Party Finder',
        subcategory: 'Requirements',
        min: 1,
        max: 500,
        step: 1,
    })
    partyFinderminLvl = 300;

    // PB
    @SelectorProperty({
        name: 'Personal Best',
        description: 'Minimum Personal Best',
        category: 'Party Finder',
        subcategory: 'Requirements',
        options: ['Sub 4:40', 'Sub 5:00', 'Sub 5:30', 'Sub 6:00', 'Custom'],
    })
    partyFinderminPB = 0;

    // PB Custom
    @TextProperty({
        name: 'Custom PB Time',
        description: 'Custom personal best time in milliseconds.',
        category: 'Party Finder',
        subcategory: 'Requirements',
    })
    partyFindercustomMinPB = "300000";
    
    // Secrets
    @TextProperty({ 
        name: 'Secret Count',
        description: 'Minimum Secret Count',
        category: 'Party Finder',
        subcategory: 'Requirements',
    })
    partyFinderminSecrets = "50000";

}

export default new Settings();