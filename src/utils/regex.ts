import { nonDejureLawList } from "../static/non_dejure";

// The list of non dejure laws are laws from buzer, lexsoft and rewis, which are not available in dejure.org.
// Unlike the dejure laws, these laws are not edited yet, so for e.g. if there are laws with same prefix,
// only the shortest one will be matched. For e.g. if there are two laws "BGB" and "BGB a.F.", only "BGB" will be matched.
// Due to this problem, the law "SG" is currently commented out in the nonDejureLawList, so that the laws "SGB I" and so on can be matched.
// White spaces should be escaped with "\\s*", which has not been done in the nonDejureLawList yet.
const nonDejureLaws = nonDejureLawList.join("|");
const lawList = `(SGB|JVollzGB)\\s*[IVX]+|AAG|AbfVerbrG|AbschlagsV|AdVermiG|AdWirkG|AEntG|AEUV|AGBG|AGBGB|AGG|AGGVG|AGVIG|AGVwGO|AktG|AMG|AnfG|AO|ArbGG|ArbSchG|ArbZG|AsylG|AÜG|AufenthG|AufenthV|BauFordSiG|BauGB|BauNVO|BauPG|BauPrüfVO|BauSparkG|BauSVO|BBG|BBodSchG|BDSG(?:\\s*a.F.)?|BeamtStG|BEEG|BerHG|BestattG|BetrAVG|BetrKV|BetrVG|BeurkG|BewG|BGB-InfoV|BGB(?:\\s*a.F.)?|BGebG|BImSchG|BKAG|BNatSchG(?:\\s*a.F.)?|BNichtrSchG|BNotO|BörsG|BORA|BRAO|Brüssel-Ia-VO|BtMG|BUrlG|BVerfGG|BVwVfG|BZRG|DepotG|DesignG|DRiG|DrittelbG|DSGVO|EEG|EEWärmeG|EG|EGBGB|EGGmbHG|EGGVG|EGHGB|EGStPO|EGVVG|EGZPO|EntgFG|EnWG|ErbbauRG|ErbStDV|ErbStG|EStDV|EStG|EU|EU-VSchDG|EuGVÜ|EuGVVO(?:\\s*a.F.)?|EuMahnverfVO|EuVTVO|EVPG|EWärmeG|FamFG|FernAbsG|FernUSG|FGG|FGO|FleischG|FStrG|FStrPrivFinG|FTG|GastG|GaVO|GBO|GBV|GemO|GenG|GeringFordVO|GeschmMG|GewO|GewSchG|GewStDV|GewStG|GG|GGV|GKG|GmbHG|GNotKG|GPSG|GRCh|GrStG|GVG|GWB|GwG(?:\\s*a.F.)?|HGB|HintG|HintO|HOAI|HPflG|HWiG|HwO|IFG|IfSG|InsO|InsVfVO(?:\\s*a.F.)?|IRG|JFDG|JGG|JStVollzG|JugendarbG|JugendBildG|JuSchG|JVEG|JVKostG|KAG(?:B)?|KapMuG|KiTaG|KostO|KrW-/AbfG|KrWG|KSchG|KStG|KunstUrhG|KWG|LAbfG|LadÖG|LBGS|LBO|LBodSchAG|LDSG|LEntG|LFGB|LFGG|LGebG|LHeimG|LKJHG|LNRSchG|LOWiG|LPartG|LPresseG|LUIG|LVG|LVwVfG|LVwVG|LVwZG|LWoFG|MaBV|MarkenG|MFG|MHG|MRK|MuSchG|NachwG|NatSchG|NRG|OASG|OEG|OWiG|PartG|PartGG|PatG|PfandBG|PflegeZG|PflVG|PolG|PreisKlG|ProdHaftG|PStG|PUAG|RDG|RDGEG|RDV|ROG|Rom-I-VO|Rom-II-VO|RPflG|RVG|SammlungsG|ScheckG|SchlG|SGG|SigG|SpG|StBerG|StGB|StiftG|StPO|StrEG|StrG|StVG|StVO|TDG|TierSchG|TKG|TMG|TPG|TTDSG|TVG|TzBfG|UBG|UBGG|UIG|UKlaG|UKlaV|UmweltHG|UmwG|UmwRG|UmwStG|UrhG|UrhWG|USchadG|UStDV|UStG|UVPG(?:\\s*a.F.)?|UWG|VAG(?:\\s*a.F.)?|VBVG|VerbrKrG|VereinsG|Verf|VermG|VersAusglG|VersG|VerstV|VgV|VIG|VkVO|VOB/A|VOB/A(?:\\s*a.F.)?|VOB/B|VStättVO|VStGB|VVG-InfoV|VVG(?:\\s*a.F.)?|VwGO|VwVG|VwZG|WaffG|WasserG|WechselG|WEG|WHG(?:\\s*a.F.)?|WiStG|WKBG|WoGG|WoVermittG|WpHG|WPO|WpPG|ZPO(?:\\s*a.F.)?|ZSHG|ZVG|ZVO|ZwVwV|${nonDejureLaws}`;

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
