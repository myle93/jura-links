import { Editor, MarkdownView, Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {

	onload() {

		this.addCommand({
			id: 'apply',
			name: 'apply',
			editorCallback: (editor: Editor) => {
				const content = editor.getDoc().getValue();
				this.logRegexMatches(content, editor);
			}
		});
	}

	onunload() {
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
		var regex = /(?<!<span class='law-article'>)(§+|Art|Artikel)\.?\s*(?<norm>\d+(?:\w\b)?)\s*(?:Abs\.\s*(?<absatz>\d+))?\s*(?:S\.\s*(?<satz>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]?))?.{0,10}?(?<gesetz>\b[A-Z][A-Za-z]*[A-Z](?:(?<buch>(?:\s|\b)[XIV]+)?))/gmi;

		if (!regex.test(fileContent)) {
		return
		}
		const url = 'https://www.gesetze-im-internet.de';
		console.log('fileContent', fileContent);
		fileContent = fileContent.replace(regex, `[<span class='law-article'>$&</span>](${url}/6/__2.html)`);
		if (editor) {
			editor.setValue(fileContent);
		}
	}
}