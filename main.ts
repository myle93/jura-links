import { Editor, Plugin } from "obsidian";
import {
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
	findAndLinkLawReferences,
} from "./src/utils/transformation";

export default class ExamplePlugin extends Plugin {
	onload() {
		// This event is triggered when document is initially opened
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

	private async readActiveFileAndLinkLegalArticles() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);
			const newFileContent = this.findAndLinkLegalReferences(content);
			if (!newFileContent) {
				return;
			}
			this.app.vault.modify(file, newFileContent);
		}
	}

	private findAndLinkLegalReferences(fileContent: string): string {
		fileContent = findAndLinkLawReferences(fileContent);
		fileContent = findAndLinkCaseReferences(fileContent);
		fileContent = findAndLinkJournalReferences(fileContent);
		return fileContent;
	}
}
