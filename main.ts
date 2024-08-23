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
	
		const lawRegex = /(?<!\.html">)(?<p1>§+|Art\.|Artikel)\.?\s*(?<p2>(?<norm>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*)\s*(?:Abs\.|Absatz\s*(?<absatz>\d+(?:\s*(,|-|und)\s*\d+)*)|(?<absatzrom>[IVXLCDM]+(?:\s*(,|-|und)\s*[IVXLCDM]+)*))?\s*(?:(S\.|Satz)?\s*(?<satz>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Alt\.|Alternative)\s*(?<alternative>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Var\.|Variante)\s*(?<variante>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Nr\.|Nummer)\s*(?<nr>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*))?\s*(?:(lit\.|Buchstabe)\s*(?<lit>[a-z][a-z-]*[a-z]?))?.{0,10}?(?:\s*(,|-|und)\s*(?<lnorm>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*)\s*(?:Abs\.|Absatz\s*(?<labsatz>\d+(?:\s*(,|-|und)\s*\d+)*)|(?<labsatzrom>[IVXLCDM]+(?:\s*(,|-|und)\s*[IVXLCDM]+)*))?\s*(?:(S\.|Satz)?\s*(?<lsatz>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Alt\.|Alternative)\s*(?<lalternative>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Var\.|Variante)\s*(?<lvariante>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Nr\.|Nummer)\s*(?<lnr>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*))?\s*(?:(lit\.|Buchstabe)\s*(?<llit>[a-z][a-z-]*[a-z]?))?.{0,10}?)*)(?<gesetz>\b[A-ZÄÖÜß][A-ZÄÖÜẞa-zäöüß-]*[A-ZÄÖÜß])\s*(?<buch>[IVX]+)?(?=\W|$)/gm;
	
		const caseRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?:[CTF]-\d+\/\d{2}|(?:[IVXLCDM]+\s*)?\d+\s*[A-Za-z]{1,3}\s*\d+\/\d{2}|\d{1,7}\/\d{2})\b/g;
	
		const journalRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>[A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(?<year>\d{4}),\s*(?<page>\d+)(?:\s*\(\d+\))?\b/gm;
	
		if (!lawRegex.test(fileContent) && !caseRegex.test(fileContent) && !journalRegex.test(fileContent)) {
			return;
		}
	
		const lawUrl = 'https://www.dejure.org/gesetze';
		const caseUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
		const journalUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
	
		fileContent = fileContent.replace(lawRegex, (match, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, groups) => {
			if(!groups?.gesetz || !groups?.norm) {
				console.log('No law or norm found in the match:', match);
				return match;
			}
			// Transform law name for the URL
			const gesetz = groups.gesetz.toLowerCase()
						   .replace(/ä/g, 'ae')
						   .replace(/ö/g, 'oe')
						   .replace(/ü/g, 'ue')
						   .replace(/ß/g, 'ss');
			
			const buch = groups.buch ? `_${groups.buch.toUpperCase()}` : '';
			const norms = groups.norm.split(/,|-|und/);
			let newMatch = match;
			norms.forEach((norm: string) => {
				norm = norm.trim();
				const normLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${norm}.html">${norm}</a>`;
				newMatch = newMatch.replace(norm, normLinks);
			});

			if(groups.lnorm) {
				const lnorms = groups.lnorm.split(/,|-|und/);
				lnorms.forEach((norm: string) => {
					norm = norm.trim();
					const normLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${norm}.html">${norm}</a>`;
					newMatch = newMatch.replace(norm, normLinks);
				});	
			}
			
			return `<span style="color: #a159e4;">${newMatch}</span>`;
			
		});
		editor.setValue(fileContent);
	}
}