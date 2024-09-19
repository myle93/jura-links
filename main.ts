import { Editor, Plugin, WorkspaceLeaf } from "obsidian";
import {
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
	findAndLinkLawReferences,
} from "./src/utils/transformation";
import {
	LawProviderSettings,
	DEFAULT_SETTINGS,
	LawProviderSettingTab,
} from "./src/view/settings";
import { LawProviderOptions } from "./src/types/providerOption";
import {
	SearchTab,
	SearchTabView,
	VIEW_TYPE_SEARCH_TAB,
} from "./src/view/searchTab";

export default class LegalReferencePlugin extends Plugin {
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

		this.addRibbonIcon("scale", "Gesetzessuche", () => {
			this.searchTab.activateView();
		});

		this.app.workspace.on("active-leaf-change", () => {
			if (this.settings.executeOnFileOpen) {
				this.readActiveFileAndLinkLegalArticles();
			}
		});

		this.addCommand({
			id: "apply",
			name: "Verlinkung starten",
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
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
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
		fileContent = findAndLinkLawReferences(
			fileContent,
			this.settings.lawProviderOptions as LawProviderOptions
		);
		fileContent = findAndLinkCaseReferences(fileContent);
		fileContent = findAndLinkJournalReferences(fileContent);
		return fileContent;
	}
}
