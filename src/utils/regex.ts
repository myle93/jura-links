import { dejureLawList } from "../static/dejureLaws";
import { nonDejureLawList } from "../static/nonDejureLaws";

// The list of non dejure laws are laws from buzer, lexsoft and rewis, which are not available in dejure.org.
// Unlike the dejure laws, these laws are not edited yet, so for e.g. if there are laws with same prefix,
// only the shortest one will be matched. For e.g. if there are two laws "BGB" and "BGB a.F.", only "BGB" will be matched.
// Due to this problem, the law "SG" is currently commented out in the nonDejureLawList, so that the laws "SGB I" and so on can be matched.
// White spaces should be escaped with "\\s*", which has not been done in the nonDejureLawList yet.
const nonDejureLaws = nonDejureLawList.join("|");
const dejureLaws = dejureLawList.join("|");
const lawList = `${dejureLaws}|${nonDejureLaws}`;

function getSingleLawRegexString(suffix: string): string {
	return `(?<normgr${suffix}>(?<norm${suffix}>\\d+(?:\\w\\b)?)\\s*(?:(Abs\\.|Absatz)\\s*(?<absatz${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*)|(?<absatzrom${suffix}>[IVXLCDM]+(?:\\s*(,|-|und)\\s*[IVXLCDM]+)*))?\\s*(?:(S\\.|Satz)?\\s*(?<satz${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Alt\\.|Alternativ)\\s*(?<alternative${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Var\\.|Variante)\\s*(?<variante${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Nr\\.|Nummer)\\s*(?<nr${suffix}>\\d+(?:\\w\\b)?(?:\\s*(,|-|und)\\s*\\d+(?:\\w\\b)?)*))?\\s*(?:(lit\\.|Buchstabe)\\s*(?<lit${suffix}>[a-z][a-z-]*[a-z]?))?.{0,10}?)`;
}

export const lawRegex = new RegExp(
	`(?!html\\">)(?<p1>§+|Art\\.|Artikel)\\s*(?<p2>${getSingleLawRegexString(
		"_first"
	)}(?:\\s*(,|-|und)\\s*${getSingleLawRegexString(
		"_last"
	)})*)(?<gesetz>${lawList})`,
	"gm"
);
export const lawChainRegex = new RegExp(
	`(?:\\s*(,|-|und)\\s*)${getSingleLawRegexString("")}`,
	"gm"
);

export const caseRegex =
	/(?<!<a\s+href="[^"]{0,1000}">)\b(?:[A-Za-z]-\d+\/\d{2}|[A-Za-z]\s*\d+\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[A-Z]-\d+\/\d{2}|\d+[A-Za-z]?\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[IVXLCDM]+\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[A-Za-z]?\d{1,7}\/\d{2})\b/g;

export const journalRegex =
	/(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>[A-Za-z][A-Za-z-.]*)\s*(?:(?<year>\d{4})(?:,\s*(?<volume1>[IVXLCDM]{1,5})-(?<page1>\d+)|,\s*(?<page2>\d+))|(?<volume2>\d+),\s*(?<page3>\d+))\b/gm;
