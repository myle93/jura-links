type LawProviderOption = "dejure" | "buzer" | "lexmea" | "lexsoft" | "rewis";

type LawProviderOptions = {
	firstOption: LawProviderOption;
	secondOption: LawProviderOption | null;
	thirdOption: LawProviderOption | null;
	forthOption: LawProviderOption | null;
	fifthOption: LawProviderOption | null;
};

export type { LawProviderOption, LawProviderOptions };
