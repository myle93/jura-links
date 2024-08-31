import { DejureUrl } from "../static/lawProvider";
import { caseRegex, journalRegex, lawChainRegex, lawRegex } from "./regex";

function findAndLinkLawReferences(fileContent: string): string {
	if (!lawRegex.test(fileContent)) {
		return fileContent;
	}

	const lawUrl = DejureUrl.LAW;

	fileContent = fileContent.replace(
		lawRegex,
		(
			match,
			p1,
			p2,
			p3,
			p4,
			p5,
			p6,
			p7,
			p8,
			p9,
			p10,
			p11,
			p12,
			p13,
			p14,
			p15,
			p16,
			p17,
			p18,
			p19,
			p20,
			p21,
			p22,
			p23,
			p24,
			p25,
			p26,
			p27,
			p28,
			p29,
			p30,
			p31,
			p32,
			p33,
			p34,
			p35,
			p36,
			p37,
			p38,
			p39,
			p40,
			p41,
			p42,
			p43,
			p44,
			p45,
			p46,
			p47,
			p48,
			p49,
			p50,
			groups
		) => {
			// Transform law name for the URL
			let gesetz = groups.gesetz
				.toLowerCase()
				.replace(/ä/g, "ae")
				.replace(/ö/g, "oe")
				.replace(/ü/g, "ue")
				.replace(/ß/g, "ss")
				.trim();

			// Transform book name for the URL
			const buch = groups.buch ? `_${groups.buch.toUpperCase()}` : "";

			if (gesetz.includes("sgb")) {
				gesetz = "sgb";
			}

			if (gesetz === "bruessel-ia-vo") {
				gesetz = "eugvvo";
			}

			// e. g. match: §§ 23 I, II, 24 II, 25 II BGB
			// lawMatch will be: 23 I, II, 24 II, 25 II
			let lawMatch: string = groups.p2;

			// fistNorm: 23
			const firstNormGroup = groups.normgr.trim();
			const firstNorm = groups.norm;
			const firstNormLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${firstNorm}.html">${firstNormGroup}</a>`;
			lawMatch = lawMatch.replace(firstNormGroup, firstNormLinks);

			// lastNorm: 25
			let lastNormGroup = groups.lnormgr;
			let lastNorm = groups.lnorm;
			if (lastNorm && lastNormGroup) {
				lastNormGroup = lastNormGroup.trim();
				lastNorm = lastNorm.trim();
				const lastNormLinks = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${lastNorm}.html">${lastNormGroup}</a>`;
				lawMatch = lawMatch.replace(lastNormGroup, lastNormLinks);
			}

			// If the match is a chain of laws, search and link for further laws
			const gp1 = groups.p1;
			if (gp1 !== "§") {
				// matches of lawRegexChain: ["", 24 II", ", 25 II"]
				lawMatch = lawMatch.replace(
					lawChainRegex,
					(
						match,
						p1,
						p2,
						p3,
						p4,
						p5,
						p6,
						p7,
						p8,
						p9,
						p10,
						p11,
						p12,
						p13,
						p14,
						p15,
						p16,
						p17,
						p18,
						p19,
						p20,
						p21,
						p22,
						p23,
						p24,
						groups
					) => {
						const norm = groups.norm.trim();
						const normGroup = groups.normgr.trim();
						const normLink = `<a class="no-underline" href="${lawUrl}/${gesetz}${buch}/${norm}.html">${normGroup}</a>`;
						match = match.replace(normGroup, normLink);
						return match;
					}
				);
			}

			match = match.replace(groups.p2, lawMatch);

			return `<span style="color: #a159e4;">${match}</span>`;
		}
	);

	return fileContent;
}

function findAndLinkCaseReferences(fileContent: string): string {
	if (!caseRegex.test(fileContent)) {
		return fileContent;
	}

	const caseUrl = DejureUrl.CASE;

	fileContent = fileContent.replace(caseRegex, (match) => {
		return `<a href="${caseUrl}${encodeURIComponent(match)}">${match}</a>`;
	});

	return fileContent;
}

function findAndLinkJournalReferences(fileContent: string): string {
	if (!journalRegex.test(fileContent)) {
		return fileContent;
	}

	const journalUrl = DejureUrl.JOURNAL;

	fileContent = fileContent.replace(
		journalRegex,
		(match, journal, year, page) => {
			return `<a href="${journalUrl}${encodeURIComponent(
				match
			)}">${match}</a>`;
		}
	);

	return fileContent;
}

export {
	findAndLinkLawReferences,
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
};
