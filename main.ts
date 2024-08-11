import { Editor, MarkdownView, Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {

	onload() {

		// This event is triggered when document is changed
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			this.logRegexMatches(content, editor);
		});
		// This event is triggered when document is initially opened
		this.app.workspace.on("active-leaf-change", () => {
			this.readActiveFileAndUpdateLineCount();
		});
	}

	onunload() {
	}

	private async readActiveFileAndUpdateLineCount() {
		const file = this.app.workspace.getActiveFile();
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const editor = view?.editor;

		if (file) {
			const content = await this.app.vault.read(file);
			this.logRegexMatches(content, editor);
		} else {
			this.logRegexMatches(undefined, editor);
		}
	}

	private logRegexMatches(fileContent?: string, editor?: Editor) {
		if (!fileContent) {
			return;
		}
		// regex groups
		// 	1 : 'norm',
		// 	2: 'absatz',
		// 	3: 'satz',
		// 	4: 'nr',
		// 	5: 'lit',
		// 	6: 'gesetz',
		var regex = /(§+|Art|Artikel)\.?\s*(\d+(?:\w\b)?)\s*(?:Abs\.\s*(\d+))?\s*(?:S\.\s*(\d+))?\s*(?:Nr\.\s*(\d+(?:\w\b)?))?\s*(?:lit\.\s*([a-z]?))?.{0,10}?(\b[A-Z][A-Za-z]*[A-Z](?:((?:\s|\b)[XIV]+)?))/gmi;
		if (!regex.test(fileContent)) {
			return
		}
		const url = 'https://www.gesetze-im-internet.de';
		fileContent = fileContent.replace(regex, `[<span class='law-article'>$&</span>](${url}/6/__2.html)`);
		if (editor) {
			editor.setValue(fileContent);
		}
	}
}