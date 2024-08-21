import { Editor, Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {

	onload() {

		// This event is triggered when document is changed
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			this.findAndReplaceLawArticlesWithHyperLinkAndIframe(content, editor);
		});
		// This event is triggered when document is initially opened
		this.app.workspace.on("active-leaf-change", () => {
			this.findAndReplaceLawArticlesWithHyperLinkAndIframe();
		});
	}

	onunload() {
	}

	private findAndReplaceLawArticlesWithHyperLinkAndIframe(fileContent?: string, editor?: Editor) {
		if (!fileContent) {
			return;
		}
	
		const lawRegex = /(?<!<a\s+href="[^"]{0,1000}">)(?<p1>§§?|Art\.?|Artikel)\s*(?<norm>(?:\d+(?:\w\b)?(?:\s*,\s*\d+(?:\w\b)?)*))(?:\s*(?:(?<absatz>[IVXLCDM]+|\d+))?\s*(?:(?<satz>\d+))?\s*(?:Alt\.\s*(?<alternative>\d+))?\s*(?:Var\.\s*(?<variante>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]))?)?\s*(?<gesetz>[A-Z][A-ZÄÖÜßa-zäöüß0-9-]*(?:-[IVX]+)?(?:-[A-Za-z0-9]+)*)\s*(?<buch>[IVX]+)?(?=\W|$)/gm;
	
		const caseRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?:[CTF]-\d+\/\d{2}|(?:[IVXLCDM]+\s*)?\d+\s*[A-Za-z]{1,3}\s*\d+\/\d{2}|\d{1,7}\/\d{2})\b/g;
	
		const journalRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>[A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(?<year>\d{4}),\s*(?<page>\d+)(?:\s*\(\d+\))?\b/gm;
	
		if (!lawRegex.test(fileContent) && !caseRegex.test(fileContent) && !journalRegex.test(fileContent)) {
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