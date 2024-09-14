import { DejureUrl } from "../types/url";
import { LawProviderOptions } from "../types/providerOption";
import { caseRegex, journalRegex, lawChainRegex, lawRegex } from "./regex";
import { getLawUrlByProviderOptions } from "./urlHelper";

function findAndLinkLawReferences(
	fileContent: string,
	lawProviderOptions: LawProviderOptions
  ): string {
	if (!lawRegex.test(fileContent)) {
	  return fileContent;
	}

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
			groups
		) => {
			// Transform law name for the URL
			let gesetz = groups.gesetz.trim().toLocaleLowerCase();

			if (gesetz === "brüssel-ia-vo") {
				gesetz = "eugvvo";
			}

			// e. g. match: §§ 23 I, II, 24 II, 25 II BGB
			// lawMatch will be: 23 I, II, 24 II, 25 II
			let lawMatch: string = groups.p2;

			// fistNorm: 23
			const firstNormGroup = groups.normgr_first.trim();
			const firstNorm = groups.norm_first;
			const firstNormLink = getHyperlinkForLawIfExists(
				firstNormGroup,
				gesetz,
				firstNorm,
				lawProviderOptions
			);
			lawMatch = lawMatch.replace(firstNormGroup, firstNormLink);

			// lastNorm: 25
			let lastNormGroup = groups.normgr_last;
			let lastNorm = groups.norm_last;
			if (lastNorm && lastNormGroup) {
				lastNormGroup = lastNormGroup.trim();
				lastNorm = lastNorm.trim();
				const lastNormLink = getHyperlinkForLawIfExists(
					lastNormGroup,
					gesetz,
					lastNorm,
					lawProviderOptions
				);
				lawMatch = lawMatch.replace(lastNormGroup, lastNormLink);
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
						const normLink = getHyperlinkForLawIfExists(
							normGroup,
							gesetz,
							norm,
							lawProviderOptions
						);
						match = match.replace(normGroup, normLink);
						return match;
					}
				);
			}

			match = match.replace(groups.p2, lawMatch);

			return match;
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
		return `<a href="${caseUrl}${match}">${match}</a>`;
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
			return `<a href="${journalUrl}${match}">${match}</a>`;
		}
	);

	return fileContent;
}

/*
Get hyperlink for the given @gesetz and @norm if the law is provided by one of the give @lawProviderOptions.
Else return the @normGroup.
*/
function getHyperlinkForLawIfExists(
	normGroup: string,
	gesetz: string,
	norm: string,
	lawProviderOptions: LawProviderOptions
): string {
	const lawUrl = getLawUrlByProviderOptions(gesetz, norm, lawProviderOptions);
	if (lawUrl) {
		return `<a href="${lawUrl}">${normGroup.trim()}</a>`;
	}
	return normGroup;
}

export {
	findAndLinkLawReferences,
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
};
