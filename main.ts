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
		if (!fileContent || !editor) {
			return;
		}
	
		const lawRegex = /(?<!<a\s+href="[^"]{0,1000}">)(?<p1>§§?|Art\.?|Artikel)\s*(?<norm>(?:\d+(?:\w\b)?(?:\s*,\s*\d+(?:\w\b)?)*))(?:\s*(?:(?<absatz>[IVXLCDM]+|\d+))?\s*(?:(?<satz>\d+))?\s*(?:Alt\.\s*(?<alternative>\d+))?\s*(?:Var\.\s*(?<variante>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]))?)?\s*(?<gesetz>[A-Z][A-ZÄÖÜßa-zäöüß0-9-]*(?:-[IVX]+)?(?:-[A-Za-z0-9]+)*)\s*(?<buch>[IVX]+)?(?=\W|$)/gm;
	
		const caseRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?:[CTF]-\d+\/\d{2}|(?:[IVXLCDM]+\s*)?\d+\s*[A-Za-z]{1,3}\s*\d+\/\d{2}|\d{1,7}\/\d{2})\b/g;
	
		const journalRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>[A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(?<year>\d{4}),\s*(?<page>\d+)(?:\s*\(\d+\))?\b/gm;
	
		if (!lawRegex.test(fileContent) && !caseRegex.test(fileContent) && !journalRegex.test(fileContent)) {
			return;
		}
	
		const lawUrl = 'https://www.dejure.org/gesetze';
		const caseUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
		const journalUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
	
		fileContent = fileContent.replace(lawRegex, (match, p1, norm, absatz, satz, alternative, variante, nr, lit, gesetz, buch) => {
			console.log(match);
			// Transform law name for the URL
			gesetz = gesetz.toLowerCase()
						   .replace(/ä/g, 'ae')
						   .replace(/ö/g, 'oe')
						   .replace(/ü/g, 'ue')
						   .replace(/ß/g, 'ss');
			
			buch = buch ? `_${buch.toUpperCase()}` : '';
	
			// Check if it's a chain of laws (§§ or Artt.)
			if (p1 === '§§' || p1 === 'Artt.') {
				const normList = norm.split(',').map((n: string) => n.trim());
				const links = normList.map((n: string, index: number) => {
					return `<a href="${lawUrl}/${gesetz}${buch}/${n}.html">${index === 0 ? p1.charAt(0) : ''} ${n}</a>`;
				}).join(', ');
				
				const extras = [absatz, satz, alternative, variante, nr, lit].filter(Boolean).join(' ');
				return `${links}${extras ? ' ' + extras : ''} ${gesetz.toUpperCase()}`;
			} else {
				return `<a href="${lawUrl}/${gesetz}${buch}/${norm}.html">${match}</a>`;
			}
		});
	
		fileContent = fileContent.replace(caseRegex, (match) => {
			return `<a href="${caseUrl}${encodeURIComponent(match)}">${match}</a>`;
		});
	
		fileContent = fileContent.replace(journalRegex, (match, journal, year, page) => {
			return `<a href="${journalUrl}${encodeURIComponent(match)}">${match}</a>`;
		});
	
		editor.getDoc().setValue(fileContent);
	}
}