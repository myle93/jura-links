import { App, PluginSettingTab, Setting } from 'obsidian';
import ExamplePlugin from '../../main';
import { LawProviderOption } from '../types/providerOption';

export interface LawProviderSettings {
    lawProviderOptions: {
        firstOption: LawProviderOption;
        secondOption: LawProviderOption;
        thirdOption: LawProviderOption;
        forthOption: LawProviderOption;
        fifthOption: LawProviderOption;
    };
}

export const DEFAULT_SETTINGS: LawProviderSettings = {
    lawProviderOptions: {
        firstOption: 'dejure',
        secondOption: 'lexsoft',
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
        containerEl.createEl('h2', { text: 'Bevorzugte Gesetzesanbieter' });

        const providers: LawProviderOption[] = ['dejure', 'lexsoft', 'lexmea', 'buzer', 'rewis'];

        const createDropdown = (name: string, desc: string, settingKey: keyof LawProviderSettings['lawProviderOptions']) => {
            const setting = new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addDropdown(dropdown => {
                    providers.forEach(provider => dropdown.addOption(provider, provider));
                    dropdown.setValue(this.plugin.settings.lawProviderOptions[settingKey])
                        .onChange(async (value: string) => {
                            if (this.isValidLawProviderOption(value)) {
                                this.plugin.settings.lawProviderOptions[settingKey] = value;
                                await this.plugin.saveSettings();
                                this.validateSelections();
                            }
                        });
                    dropdown.selectEl.name = settingKey;
                });

            setting.controlEl.querySelector('.setting-control-extra')?.remove();

            const errorSpan = setting.controlEl.createEl('div', { cls: 'error-message', text: 'Der Gesetzesanbieter wurde bereits ausgewählt' });
            errorSpan.style.display = 'none';
            errorSpan.style.color = 'red';
            errorSpan.style.fontSize = '0.8em';
            errorSpan.style.marginTop = '0.5em';
        };

        createDropdown('1. Wahl', 'Wähle deinen bevorzugten Gesetzesanbieter:', 'firstOption');
        createDropdown('2. Wahl', 'Wähle deinen zweiten bevorzugten Gesetzesanbieter:', 'secondOption');
        createDropdown('3. Wahl', 'Wähle deinen dritten bevorzugten Gesetzesanbieter:', 'thirdOption');
        createDropdown('4. Wahl', 'Wähle deinen vierten bevorzugten Gesetzesanbieter:', 'forthOption');
        createDropdown('5. Wahl', 'Wähle deinen fünften bevorzugten Gesetzesanbieter:', 'fifthOption');

        this.validateSelections();
    }

    validateSelections(): void {
        const selectedValues = new Set<LawProviderOption>();
        const settings = this.plugin.settings.lawProviderOptions;
        const keys: (keyof LawProviderSettings['lawProviderOptions'])[] = ['firstOption', 'secondOption', 'thirdOption', 'forthOption', 'fifthOption'];

        keys.forEach(key => {
            const value = settings[key];
            const dropdown = this.containerEl.querySelector(`select[name="${key}"]`);
            const errorMessage = dropdown?.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;

            if (value && selectedValues.has(value)) {
                dropdown?.classList.add('error');
                errorMessage.style.display = 'block';
            } else {
                dropdown?.classList.remove('error');
                errorMessage.style.display = 'none';
                if (value) {
                    selectedValues.add(value);
                }
            }
        });
    }

    isValidLawProviderOption(value: string): value is LawProviderOption {
        return ['dejure', 'lexsoft', 'lexmea', 'buzer', 'rewis'].includes(value);
    }
}