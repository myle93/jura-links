import { Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarElement: HTMLSpanElement;

	onload() {
		this.statusBarElement = this.addStatusBarItem().createEl("span");

		this.readActiveFileAndUpdateLineCount();

		// This event is triggered when document is changed
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			this.logRegexMatches(content);
		});
		// This event is triggered when document is initially opened
		this.app.workspace.on("active-leaf-change", () => {
			this.readActiveFileAndUpdateLineCount();
		});
	}

	onunload() {
		this.statusBarElement.remove();
	}

	private async readActiveFileAndUpdateLineCount() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);
			this.logRegexMatches(content);
		} else {
			this.logRegexMatches(undefined);
		}
	}

	private logRegexMatches(fileContent?: string) {
		if (!fileContent) {
			return;
		}

		var regex = /(§+|Art|Artikel)\.?\s*(\d+(?:\w\b)?)\s*(?:Abs\.\s*(\d+))?\s*(?:S\.\s*(\d+))?\s*(?:Nr\.\s*(\d+(?:\w\b)?))?\s*(?:lit\.\s*([a-z]?))?.{0,10}?(\b[A-Z][A-Za-z]*[A-Z](?:((?:\s|\b)[XIV]+)?))/gmi;
		console.log(fileContent.match(regex));
	}
}