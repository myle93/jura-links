// Remove empty lines if needed
const lawList =
	"AAG|AbfVerbrG|AbschlagsV|AdVermiG|AdWirkG|AEntG|AEUV|AGBG|AGBGB|AGG|AGGVG|AGVIG|AGVwGO|AktG|AMG|AnfG|AO|ArbGG|ArbSchG|ArbZG|AsylG|AÜG|AufenthG|AufenthV|BauFordSiG|BauGB|BauNVO|BauPG|BauPrüfVO|BauSparkG|BauSVO|BBG|BBodSchG|BDSG|BDSG a.F.|BeamtStG|BEEG|BerHG|BestattG|BetrAVG|BetrKV|BetrVG|BeurkG|BewG|BGB|BGB-InfoV|BGB a.F.|BGebG|BImSchG|BKAG|BNatSchG|BNatSchG a.F.|BNichtrSchG|BNotO|BörsG|BORA|BRAO|Brüssel-Ia-VO|BtMG|BUrlG|BVerfGG|BVwVfG|BZRG|DepotG|DesignG|DRiG|DrittelbG|DSGVO|EEG|EEWärmeG|EG|EGBGB|EGGmbHG|EGGVG|EGHGB|EGStPO|EGVVG|EGZPO|EntgFG|EnWG|ErbbauRG|ErbStDV|ErbStG|EStDV|EStG|EU|EU-VSchDG|EuGVÜ|EuGVVO|EuGVVO a.F.|EuMahnverfVO|EuVTVO|EVPG|EWärmeG|FamFG|FernAbsG|FernUSG|FGG|FGO|FleischG|FStrG|FStrPrivFinG|FTG|GastG|GaVO|GBO|GBV|GemO|GenG|GeringFordVO|GeschmMG|GewO|GewSchG|GewStDV|GewStG|GG|GGV|GKG|GmbHG|GNotKG|GPSG|GRCh|GrStG|GVG|GWB|GwG|GwG a.F.|HGB|HintG|HintO|HOAI|HPflG|HWiG|HwO|IFG|IfSG|InsO|InsVfVO|InsVfVO a.F.|IRG|JFDG|JGG|JStVollzG|JugendarbG|JugendBildG|JuSchG|JVEG|JVKostG|JVollzGB I|JVollzGB II|JVollzGB III|JVollzGB IV|KAG|KAGB|KapMuG|KiTaG|KostO|KrW-/AbfG|KrWG|KSchG|KStG|KunstUrhG|KWG|LAbfG|LadÖG|LBGS|LBO|LBodSchAG|LDSG|LEntG|LFGB|LFGG|LGebG|LHeimG|LKJHG|LNRSchG|LOWiG|LPartG|LPresseG|LUIG|LVG|LVwVfG|LVwVG|LVwZG|LWoFG|MaBV|MarkenG|MFG|MHG|MRK|MuSchG|NachwG|NatSchG|NRG|OASG|OEG|OWiG|PartG|PartGG|PatG|PfandBG|PflegeZG|PflVG|PolG|PreisKlG|ProdHaftG|PStG|PUAG|RDG|RDGEG|RDV|ROG|Rom-I-VO|Rom-II-VO|RPflG|RVG|SammlungsG|ScheckG|SchlG|SGG|SigG|SpG|StBerG|StGB|StiftG|StPO|StrEG|StrG|StVG|StVO|TDG|TierSchG|TKG|TMG|TPG|TTDSG|TVG|TzBfG|UBG|UBGG|UIG|UKlaG|UKlaV|UmweltHG|UmwG|UmwRG|UmwStG|UrhG|UrhWG|USchadG|UStDV|UStG|UVPG|UVPG a.F.|UWG|VAG|VAG a.F.|VBVG|VerbrKrG|VereinsG|Verf|VermG|VersAusglG|VersG|VerstV|VgV|VIG|VkVO|VOB/A|VOB/A a.F.|VOB/B|VStättVO|VStGB|VVG|VVG-InfoV|VVG a.F.|VwGO|VwVG|VwZG|WaffG|WasserG|WechselG|WEG|WHG|WHG a.F.|WiStG|WKBG|WoGG|WoVermittG|WpHG|WPO|WpPG|ZPO|ZPO a.F.|ZSHG|ZVG|ZVO|ZwVwV";

function getSingleLawRegexString(suffix: string): string {
	return `(?<normgr${suffix}>(?<norm${suffix}>\\d+(?:\\w\\b)?)\\s*(?:(Abs\\.|Absatz)\\s*(?<absatz${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*)|(?<absatzrom${suffix}>[IVXLCDM]+(?:\\s*(,|-|und)\\s*[IVXLCDM]+)*))?\\s*(?:(S\\.|Satz)?\\s*(?<satz${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Alt\\.|Alternativ)\\s*(?<alternative${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Var\\.|Variante)\\s*(?<variante${suffix}>\\d+(?:\\s*(,|-|und)\\s*\\d+)*))?\\s*(?:(Nr\\.|Nummer)\\s*(?<nr${suffix}>\\d+(?:\\w\\b)?(?:\\s*(,|-|und)\\s*\\d+(?:\\w\\b)?)*))?\\s*(?:(lit\\.|Buchstabe)\\s*(?<lit${suffix}>[a-z][a-z-]*[a-z]?))?.{0,10}?)`;
}

export const lawRegex = new RegExp(
	`(?!html\\">)(?<p1>§+|Art\\.|Artikel)\\s*(?<p2>${getSingleLawRegexString(
		"_first"
	)}(?:\\s*(,|-|und)\\s*${getSingleLawRegexString(
		"_last"
	)})*)(?<gesetz>(SGB\\s*(?<buch>[IVX]+)|${lawList}))`,
	"gm"
);

export const lawChainRegex = new RegExp(
	`(?:\\s*(,|-|und)\\s*)${getSingleLawRegexString("")}`,
	"gm"
);

export const caseRegex =
	/(?<!<a\s+href="[^"]{0,1000}">)\b(?:[A-Za-z]-\d+\/\d{2}|[A-Za-z]\s*\d+\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[A-Z]-\d+\/\d{2}|\d+[A-Za-z]?\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[IVXLCDM]+\s*[A-Za-z]{1,3}\s*\d+\s*[A-Za-z]{0,3}\s*\d+\/\d{2}(?:\s*[A-Za-z])?|[A-Za-z]?\d{1,7}\/\d{2})\b/g;

export const journalRegex =
	/(?<!<a\s+href="[^"]{0,1000}">)\b(?<journal>BVerwGE|BGHZ|BGHSt|BFHE|BAGE|BVerfGE|BSGE|Slg\.|afp|NVwZ|[A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(?:(?<year>\d{4})(?:,\s*(?<volume1>[IVXLCDM]{1,5})-(?<page1>\d+)|,\s*(?<page2>\d+))|(?<volume2>\d+),\s*(?<page3>\d+))\b/gm;
