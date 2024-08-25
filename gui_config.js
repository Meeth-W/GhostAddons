import { manhattanDistance } from "../BloomCore/utils/Utils";
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
        const categories = ['General', 'Slot Binding', 'Party Finder', 'Blood Helper', 'Drag Prio', 'Timers', 'Auto Leap', 'Fast Leap', 'Secrets', 'Door Skip', 'Alerts', 'Location Messages', 'Rat Protection', 'Auto Four', 'Auto Relic', 'Lowballing'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {

    relicSpawnTimerGui = new Gui()
    crystalSpawnTimerGui = new Gui()
    invincibilityTimerGui = new Gui()
    fastLeapGui = new Gui()

    constructor() {
        this.initialize(this);
    }


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

    @ButtonProperty({
        name: "Move Fast Leap GUI",
        description: "Scroll to change scale, middle click to reset",
        category: "Fast Leap",
        subcategory: "Settings",
        placeholder: "Move"
    })
    MoveFastLeapGui() {
        this.fastLeapGui.open()
    };

}

export default new Settings();