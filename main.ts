import { Editor, Plugin } from "obsidian";

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
		var regex = /(?<!<span class='law-article'>)(?<art>§+|Art|Artikel)\.?\s*(?<norm>\d+(?:\w\b)?)\s*(?:Abs\.\s*(?<absatz>\d+))?\s*(?:S\.\s*(?<satz>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]?))?.{0,10}?(?<gesetz>\b[A-Z][A-Za-z]*[A-Z](?:(?<buch>(?:\s|\b)[XIV]+)?))/gm;

		if (!regex.test(fileContent)) {
		return
		}
		const url = 'https://www.gesetze-im-internet.de';
		fileContent = fileContent.replace(regex, (match, art, norm, absatz, satz, nr, lit, gesetz, buch) => {
			gesetz = gesetz.toLowerCase();
			return `<a class="iframe-link" href="${url}/${gesetz}/__${norm}.html">${match}<iframe src="${url}/${gesetz}/__${norm}.html"></iframe></a>`
		});
		if (editor) {
			editor.setValue(fileContent);
		}
	}
}