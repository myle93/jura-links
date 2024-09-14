import { ItemView, WorkspaceLeaf, DropdownComponent, ButtonComponent, Setting } from 'obsidian';
import { lexsoftGesetze } from '../static/lexsoftGesetze';
import { dejureGesetze } from '../static/dejureGesetze';
import { rewisGesetze } from '../static/rewisGesetze';
import { buzerGesetze } from '../static/buzerGesetze';
import { lexmeaGesetze } from '../static/lexmeaGesetze';
import { LawProviderOption } from '../types/providerOption';
import ExamplePlugin from '../../main';

export const VIEW_TYPE_SEARCH_TAB = 'search-tab';

export class SearchTab {
    constructor(private plugin: ExamplePlugin) {}
  
    async activateView() {
      this.plugin.activateSearchTab();
    }
  }

export class SearchTabView extends ItemView {
    selectedState: string | null = null;
    selectedProvider: LawProviderOption | null = null;
    resultsContainer: HTMLElement | null = null; 

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_SEARCH_TAB;
    }

    getDisplayText() {
        return 'Gesetzes-Suche';
    }

    getIcon() {
        return 'scale';
    }

    async onOpen() {
        this.resetView();
    }

    async onClose() {
        // Cleanup code here
    }

    resetView(): void {
        const containerEl = this.containerEl.children[1];
        containerEl.empty();
        
        const searchTabContainer = containerEl.createEl('div', { cls: 'search-tab-container' });
        const controlsContainer = searchTabContainer.createEl('div', { cls: 'search-tab-controls' });
        this.resultsContainer = searchTabContainer.createEl('div', { cls: 'law-results' });

        controlsContainer.createEl('h2', { text: 'Gesetzes-Suche' });

        // Suchfeld
        new Setting(controlsContainer)
            .setName('Gesetzesabkürzung')
            .setDesc('Geben Sie die Gesetzesabkürzung ein.')
            .addText(text => text.onChange(value => {
                this.searchLaw(value);
            }));

        // Filter 1: Bundesländer Dropdown
        const bundeslandDropdown = new DropdownComponent(controlsContainer);
        this.createBundeslandFilter(bundeslandDropdown);
        bundeslandDropdown.selectEl.addClass('margin-bottom');

        // Filter 2: Gesetzesanbieter Dropdown
        const gesetzesAnbieterDropdown = new DropdownComponent(controlsContainer);
        this.createAnbieterFilter(gesetzesAnbieterDropdown);

        // Container für den Reset-Button
        const resetButtonContainer = controlsContainer.createEl('div', { cls: 'reset-button-container margin-top' });

        const resetButton = new ButtonComponent(resetButtonContainer);
        resetButton.setButtonText('Zurücksetzen')
            .onClick(() => {
                this.resetView();
            });

        // Wenn der erste Filter aktiviert wird, den zweiten deaktivieren
        bundeslandDropdown.onChange(value => {
            gesetzesAnbieterDropdown.setDisabled(true);
            this.selectedState = value;
            this.selectedProvider = null;
            this.filterByBundesland(value);
        });

        // Wenn der zweite Filter aktiviert wird, den ersten deaktivieren
        gesetzesAnbieterDropdown.onChange(value => {
            bundeslandDropdown.setDisabled(true);
            this.selectedProvider = value as LawProviderOption;
            this.selectedState = null;
            this.filterByAnbieter(value);
        });

        
    }

    searchLaw(query: string): void {
        this.clearResults();
        if (!this.resultsContainer) return;
    
        const allLaws = [
            ...this.extractDejureLaws().map(law => ({ law, provider: 'Dejure' })),
            ...this.extractRewisLaws().map(law => ({ law, provider: 'Rewis' })),
            ...this.extractBuzerLaws().map(law => ({ law, provider: 'Buzer' })),
            ...this.extractLexmeaLaws().map(law => ({ law, provider: 'Lexmea' }))
        ];
        
        const filteredLaws = allLaws.filter(item => 
            item.law.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredLaws.length > 0) {
            const groupedByProvider = filteredLaws.reduce((acc, item) => {
                if (!acc[item.provider]) {
                    acc[item.provider] = [];
                }
                acc[item.provider].push(item.law);
                return acc;
            }, {} as Record<string, string[]>);
    
            Object.entries(groupedByProvider).forEach(([provider, laws]) => {
                if (this.resultsContainer) {
                    // Anbieter fett markiert anzeigen
                    this.resultsContainer.createEl('div', { text: provider, cls: 'header' });
    
                    // Gesetze unter dem Anbieter auflisten
                    laws.forEach(law => {
                        if (this.resultsContainer) {
                            this.resultsContainer.createEl('div', { text: law, cls: 'gesetz-item' });
                        }
                    });
                }
            });
        } else {
            if (this.resultsContainer) {
                this.resultsContainer.createEl('div', { text: 'Keine Gesetze gefunden.' });
            }
        }
        if (this.resultsContainer) {
            this.resultsContainer.createEl('div', { cls: 'bottom-spacer' });
        }
    }

    createBundeslandFilter(dropdown: DropdownComponent): void {
        dropdown.addOption("", "Wählen Sie ein Bundesland");
        Object.keys(lexsoftGesetze).forEach(state => {
            dropdown.addOption(state, state);
        });
    }

    filterByBundesland(bundesland: string): void {
        this.clearResults();
        const resultContainer = this.containerEl.querySelector('.law-results');
        if (!resultContainer) return;

        const scrollContainer = resultContainer.createEl('div', { cls: 'scroll-container' });

        const laws = lexsoftGesetze[bundesland];
        if (laws) {
            Object.keys(laws).forEach(abbreviation => {
                scrollContainer.createEl('div', { text: abbreviation });
            });
        }
        scrollContainer.createEl('div', { cls: 'bottom-spacer' });
    }

    createAnbieterFilter(dropdown: DropdownComponent): void {
        dropdown.addOption("", "Wählen Sie einen Anbieter");
        ['Dejure', 'LexSoft', 'LexMea', 'Buzer', 'Rewis'].forEach(provider => {
            dropdown.addOption(provider, provider);
        });
    }

    filterByAnbieter(anbieter: string): void {
        this.clearResults();
        const resultContainer = this.containerEl.querySelector('.law-results');
        if (!resultContainer) return;
    
        const scrollContainer = resultContainer.createEl('div', { cls: 'scroll-container' });
    
        if (anbieter === 'LexSoft') {
            Object.entries(lexsoftGesetze).forEach(([bundesland, gesetze]) => {
                // Bundesland als fettgedruckte Überschrift
                scrollContainer.createEl('div', { text: bundesland, cls: 'header' });
                
                // Gesetze des Bundeslandes
                Object.keys(gesetze).sort((a, b) => a.localeCompare(b)).forEach(gesetz => {
                    scrollContainer.createEl('div', { text: gesetz, cls: 'gesetz-item' });
                });
            });
        } else {
            let laws: string[] = [];
            switch (anbieter) {
                case 'Dejure':
                    laws = this.extractDejureLaws();
                    break;
                case 'LexMea':
                    laws = this.extractLexmeaLaws();
                    break;
                case 'Buzer':
                    laws = this.extractBuzerLaws();
                    laws.sort((a, b) => {
                        const isANumber = /^\d/.test(a);
                        const isBNumber = /^\d/.test(b);
                        if (isANumber && !isBNumber) return 1;
                        if (!isANumber && isBNumber) return -1;
                        return a.localeCompare(b);
                    });
                    break;
                case 'Rewis':
                    laws = this.extractRewisLaws();
                    break;
            }
    
            laws.forEach(law => {
                scrollContainer.createEl('div', { text: law });
            });
        }
        scrollContainer.createEl('div', { cls: 'bottom-spacer' });
    }

    extractLexsoftLaws(): string[] {
        return Object.values(lexsoftGesetze).flatMap(state => 
            Object.keys(state)
        );
    }

    extractDejureLaws(): string[] {
        return dejureGesetze;
    }

    extractRewisLaws(): string[] {
        return rewisGesetze;
    }

    extractBuzerLaws(): string[] {
        return Object.keys(buzerGesetze);
    }

    extractLexmeaLaws(): string[] {
        return lexmeaGesetze;
    }


    clearResults(): void {
        if (this.resultsContainer) {
            this.resultsContainer.empty();
        }
    }
}