import { Editor, Plugin } from "obsidian";
import {
  findAndLinkCaseReferences,
  findAndLinkJournalReferences,
  findAndLinkLawReferences,
} from "./src/utils/transformation";
import { LawProviderSettings, DEFAULT_SETTINGS, LawProviderSettingTab } from "./src/utils/settings";
import { LawProviderOption } from "./src/types/providerOption";

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

  async onload() {
    await this.loadSettings();

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

    this.addSettingTab(new LawProviderSettingTab(this.app, this));
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