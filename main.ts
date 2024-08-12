import { Editor, Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {

	onload() {

		this.addCommand({
			id: 'apply',
			name: 'apply',
			editorCallback: (editor: Editor) => {
				const content = editor.getDoc().getValue();
				this.findAndReplaceLawArticlesWithHyperLinkAndIframe(content, editor);
			}
		});
	}

	onunload() {
	}

	private findAndReplaceLawArticlesWithHyperLinkAndIframe(fileContent?: string, editor?: Editor) {
		if (!fileContent) {
			return;
		}
		var regex = /(?<!\.html">)(?<art>§+|Art|Artikel)\.?\s*(?<norm>\d+(?:\w\b)?)\s*(?:Abs\.\s*(?<absatz>\d+))?\s*(?:S\.\s*(?<satz>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]?))?.{0,10}?(?<gesetz>\b[A-Z][A-Za-z]*[A-Z](?:(?<buch>(?:\s|\b)[XIV]+)?))/gm;

		if (!regex.test(fileContent)) {
		return
		}
		if (!editor) {
			return;
		}
		const url = 'https://www.gesetze-im-internet.de';
		fileContent = fileContent.replace(regex, (match, art, norm, absatz, satz, nr, lit, gesetz, buch) => {
			gesetz = gesetz.toLowerCase();
			var artRegex = /(?<art>§+|Art|Artikel)/gm;
			match = match.replace(artRegex, `<span class="law-article">${art}</span>`);
			return `<a class="iframe-link law-article" href="${url}/${gesetz}/__${norm}.html">${match}<iframe src="${url}/${gesetz}/__${norm}.html"></iframe></a>`
		});
		editor.setValue(fileContent);
	}
}