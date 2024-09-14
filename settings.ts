import { App, PluginSettingTab, Setting } from 'obsidian';
import ExamplePlugin from '../../main';
import { LawProviderOption } from '../types/providerOption';

export interface LawProviderSettings {
    lawProviderOptions: {
        secondOption: LawProviderOption;
        thirdOption: LawProviderOption;
        forthOption: LawProviderOption;
        fifthOption: LawProviderOption;
    };
}

export const DEFAULT_SETTINGS: LawProviderSettings = {
    lawProviderOptions: {
        secondOption: 'dejure',
        thirdOption: 'lexmea',
        forthOption: 'buzer',
        fifthOption: 'rewis',
    },
}

export class LawProviderSettingTab extends PluginSettingTab {
    plugin: ExamplePlugin;

    constructor(app: App, plugin: ExamplePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('p', { 
            text: 'LexSoft wurde standardmäßig als erster Anbieter ausgewählt, um die spezielleren Landesgesetze zuerst zu suchen. Die weiteren Anbieter werden in der Reihenfolge ihrer Auswahl durchsucht, falls das Gesetz bei LexSoft nicht gefunden wurde. Die übrigen Anbieter enthalten Bundes- und EU-Gesetze.' 
        });

        const providers: LawProviderOption[] = ['dejure', 'lexmea', 'buzer', 'rewis'];

        const providerDisplayNames: Record<LawProviderOption, string> = {
            dejure: 'Dejure',
            lexsoft: 'LexSoft',
            lexmea: 'LexMea',
            buzer: 'Buzer',
            rewis: 'Rewis'
        };

        const createDropdown = (name: string, desc: string, settingKey: keyof LawProviderSettings['lawProviderOptions']) => {
            new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addDropdown(dropdown => {
                    providers.forEach(provider => {
                        dropdown.addOption(provider, providerDisplayNames[provider]);
                    });
                    dropdown.setValue(this.plugin.settings.lawProviderOptions[settingKey]);
                    dropdown.onChange(async (value: string) => {
                        const lawProviderOption = value as LawProviderOption;
                        this.plugin.settings.lawProviderOptions[settingKey] = lawProviderOption;
                        await this.plugin.saveSettings();
                    });
                });
        };

        // Erstelle Dropdowns für die verbleibenden Optionen
        createDropdown('1. Wahl', 'Falls Gesetz bei LexSoft nicht verfügbar ist, soll geschaut werden in:', 'secondOption');
        createDropdown('2. Wahl', 'Falls Gesetz beim vorherigen Anbieter nicht verfügbar ist, soll geschaut werden in:', 'thirdOption');
        createDropdown('3. Wahl', 'Falls Gesetz beim vorherigen Anbieter nicht verfügbar ist, soll geschaut werden in:', 'forthOption');
        createDropdown('4. Wahl', 'Falls Gesetz beim vorherigen Anbieter nicht verfügbar ist, soll geschaut werden in:', 'fifthOption');
    }
}