import { Editor, Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {

	onload() {
		// This event is triggered when document is initially opened
		this.app.workspace.on("active-leaf-change", () => {
			this.readActiveFileAndLinkLegalArticles();
		});

		// This event is triggered when document is changed
		this.app.workspace.on("editor-change", (editor) => {
			this.linkLegalArticlesForFistLineOfLastParagraph(editor);
		});

		this.addCommand({
			id: 'apply',
			name: 'apply',
			editorCallback: (editor: Editor) => {
				const content = editor.getDoc().getValue();
				const newContent = this.findAndLinkLegalArticles(content);
				if (!newContent) {
					return;
				}
				editor.setValue(newContent);
			}
		});
	}

	onunload() {
	}

	private async readActiveFileAndLinkLegalArticles() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);
			const newFileContent = this.findAndLinkLegalArticles(content);
			if (!newFileContent) {
				return;
			}
			this.app.vault.modify(file, newFileContent);
		}
	}

	private linkLegalArticlesForFistLineOfLastParagraph(editor: Editor) {
		// If the editor is currently one-line, edit the current line.
		if(editor.lineCount() === 1) {
			this.editCurrentLine(editor);
			return;
		}
		// A new paragraph is created when the previous line is empty.
		// So if the previous line is not empty, return.
		// Else edit the current line.
		const previousLineContent = editor.getLine(editor.lastLine()-1)
		console.log(previousLineContent);
		if (previousLineContent.trim().length > 0) {
			return;
		}
		this.editCurrentLine(editor);		
	}

	private editCurrentLine(editor: Editor) {
		const currentLineContent = editor.getLine(editor.lastLine());
		const newcurrentLineContent = this.findAndLinkLegalArticles(currentLineContent);
		if (!newcurrentLineContent) {
			return;
		}
		editor.setLine(editor.lastLine(), newcurrentLineContent);
	}

	private findAndLinkLegalArticles(fileContent: string){
		
		const lawRegex = /(?<!html">)(?<p1>§+|Art\.|Artikel)\s*(?<p2>(?<normgr>(?<norm>\d+(?:\w\b)?)\s*(?:(Abs\.|Absatz)\s*(?<absatz>\d+(?:\s*(,|-|und)\s*\d+)*)|(?<absatzrom>[IVXLCDM]+(?:\s*(,|-|und)\s*[IVXLCDM]+)*))?\s*(?:(S\.|Satz)?\s*(?<satz>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Alt\.|Alternativ)\s*(?<alternative>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Var\.|Variante)\s*(?<variante>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Nr\.|Nummer)\s*(?<nr>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*))?\s*(?:(lit\.|Buchstabe)\s*(?<lit>[a-z][a-z-]*[a-z]?))?.{0,10}?)(?:\s*(,|-|und)\s*(?<lnormgr>(?<lnorm>\d+(?:\w\b)?)\s*(?:(Abs\.|Absatz)\s*(?<labsatz>\d+(?:\s*(,|-|und)\s*\d+)*)|(?<labsatzrom>[IVXLCDM]+(?:\s*(,|-|und)\s*[IVXLCDM]+)*))?\s*(?:(S\.|Satz)?\s*(?<lsatz>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Alt\.|Alternativ)\s*(?<lalternative>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Var\.|Variante)\s*(?<lvariante>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Nr\.|Nummer)\s*(?<lnr>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*))?\s*(?:(lit\.|Buchstabe)\s*(?<llit>[a-z][a-z-]*[a-z]?))?.{0,10}?))*)(?<gesetz>(SGB\s*(?<buch>[IVX]+)|\b[A-ZÄÖÜß][A-ZÄÖÜẞa-zäöüß-]*[A-ZÄÖÜß]))/gm;

		const lawChainRegex = /(?:\s*(,|-|und)\s*)(?<normgr>(?<norm>\d+(?:\w\b)?)\s*(?:(Abs\.|Absatz)\s*(?<absatz>\d+(?:\s*(,|-|und)\s*\d+)*)|(?<absatzrom>[IVXLCDM]+(?:\s*(,|-|und)\s*[IVXLCDM]+)*))?\s*(?:(S\.|Satz)?\s*(?<satz>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Alt\.|Alternativ)\s*(?<alternative>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Var\.|Variante)\s*(?<variante>\d+(?:\s*(,|-|und)\s*\d+)*))?\s*(?:(Nr\.|Nummer)\s*(?<nr>\d+(?:\w\b)?(?:\s*(,|-|und)\s*\d+(?:\w\b)?)*))?\s*(?:(lit\.|Buchstabe)\s*(?<lit>[a-z][a-z-]*[a-z]?))?.{0,10}?)/gm;
	
		const caseRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?:[CTF]-\d+\/\d{2}|(?:[IVXLCDM]+\s*)?\d+\s*[A-Za-z]{1,3}\s*\d+\/\d{2}|\d{1,7}\/\d{2})\b/g;
	
		const journalRegex = /(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>[A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(?<year>\d{4}),\s*(?<page>\d+)(?:\s*\(\d+\))?\b/gm;
	
		if (!lawRegex.test(fileContent) && !caseRegex.test(fileContent) && !journalRegex.test(fileContent)) {
			return;
		}
	
		const lawUrl = 'https://www.dejure.org/gesetze';
		const caseUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
		const journalUrl = 'https://dejure.org/dienste/vernetzung/rechtsprechung?Text=';
	
		fileContent = fileContent.replace(lawRegex, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, groups) => {

			// Transform law name for the URL
			const gesetz = groups.gesetz.toLowerCase()
						   .replace(/ä/g, 'ae')
						   .replace(/ö/g, 'oe')
						   .replace(/ü/g, 'ue')
						   .replace(/ß/g, 'ss');
			
			const buch = groups.buch ? `_${groups.buch.toUpperCase()}` : '';

			if(gesetz === 'sgb' && !groups.buch) {
				let p1 = groups.p1;
				match = match.replace(p1, `<span>${p1}</span>`);
				return match;
			}

			// e. g. match: §§ 23 I, II, 24 II, 25 II BGB
			// lawMatch will be: 23 I, II, 24 II, 25 II
			let lawMatch: string = groups.p2;

			// fistNorm: 23
			const firstNormGroup = groups.normgr;
			const firstNorm = firstNormGroup.norm;
			const firstNormLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${firstNorm}.html">${firstNormGroup}</a>`;
			lawMatch = lawMatch.replace(firstNormGroup, firstNormLinks);

			// lastNorm: 25
			const lastNormGroup = groups.lnormgr;
			const lastNorm = groups.lnorm;
			if(lastNorm && lastNormGroup) {
				const lastNormLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${lastNorm}.html">${lastNormGroup}</a>`;
				lawMatch = lawMatch.replace(lastNormGroup, lastNormLinks);
			}

			const gp1 = groups.p1;
			if(/§§+/.test(gp1)) {
				// matches of lawRegexChain: ["", 24 II", ", 25 II"]
				lawMatch = lawMatch.replace(lawChainRegex, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, groups) => {
					const norm = groups.norm;
					const normGroup = groups.normgr;
					const normLink = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${norm}.html">${normGroup}</a>`;
					match = match.replace(normGroup, normLink);
					return match;
				});
			}

			match = match.replace(groups.p2, lawMatch);
			
			return `<span style="color: #a159e4;">${match}</span>`;
			
		});
	
		fileContent = fileContent.replace(caseRegex, (match) => {
			return `<a href="${caseUrl}${encodeURIComponent(match)}">${match}</a>`;
		});
	
		fileContent = fileContent.replace(journalRegex, (match, journal, year, page) => {
			return `<a href="${journalUrl}${encodeURIComponent(match)}">${match}</a>`;
		});
	
		return fileContent;
	}
}