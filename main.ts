import { Editor, Plugin, WorkspaceLeaf } from "obsidian";
import {
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
	findAndLinkLawReferences,
} from "./src/utils/transformation";
import { LawProviderSettings, DEFAULT_SETTINGS, LawProviderSettingTab } from "./src/utils/settings";
import { LawProviderOption } from "./src/types/providerOption";
import { SearchTab, SearchTabView, VIEW_TYPE_SEARCH_TAB } from "./src/utils/searchTab";
  

// Aktualisieren Sie die LawProviderOptions-Schnittstelle
interface LawProviderOptions {
  firstOption: LawProviderOption;
  secondOption: LawProviderOption;
  thirdOption: LawProviderOption;
  forthOption: LawProviderOption;
  fifthOption: LawProviderOption;
}

export default class ExamplePlugin extends Plugin {
	settings!: LawProviderSettings;
	searchTab!: SearchTab;
	searchLeaf: WorkspaceLeaf | null = null;
  
	async onload() {
	  await this.loadSettings();
  
	  this.searchTab = new SearchTab(this);
	  this.addSettingTab(new LawProviderSettingTab(this.app, this));
  
	  this.registerView(
		VIEW_TYPE_SEARCH_TAB,
		(leaf) => new SearchTabView(leaf)
	  );
  
	 this.initSearchTab(); 

	  this.addRibbonIcon('scale', 'Gesetzes-Suche', () => {
		this.searchTab.activateView();
	  });
  
	  this.app.workspace.on("active-leaf-change", () => {
		this.readActiveFileAndLinkLegalArticles();
	  });
  
	  this.addCommand({
		id: "apply",
		name: "apply",
		editorCallback: (editor: Editor) => {
		  const content = editor.getDoc().getValue();
		  const newContent = this.findAndLinkLegalReferences(content);
		  editor.setValue(newContent);
		},
	  });
	}

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async initSearchTab() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_SEARCH_TAB).length) {
      return;
    }
    this.searchLeaf = this.app.workspace.getRightLeaf(false);
    if (this.searchLeaf) {
      await this.searchLeaf.setViewState({
        type: VIEW_TYPE_SEARCH_TAB,
        active: true,
      });
    }
  }

  activateSearchTab() {
    if (this.searchLeaf) {
      this.app.workspace.revealLeaf(this.searchLeaf);
    } else {
      this.initSearchTab();
    }
  }

  private async readActiveFileAndLinkLegalArticles() {
    const file = this.app.workspace.getActiveFile();
    if (file) {
      const content = await this.app.vault.read(file);
      const newFileContent = this.findAndLinkLegalReferences(content);
      if (newFileContent !== content) {
        await this.app.vault.modify(file, newFileContent);
      }
    }
  }

  private findAndLinkLegalReferences(fileContent: string): string {
    fileContent = findAndLinkLawReferences(fileContent, this.settings.lawProviderOptions as LawProviderOptions);
    fileContent = findAndLinkCaseReferences(fileContent);
    fileContent = findAndLinkJournalReferences(fileContent);
    return fileContent;
  }
}