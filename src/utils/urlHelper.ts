import { dejureGesetze } from "../static/dejureGesetze";
import { LawProviderOption, LawProviderOptions } from "../types/providerOption";
import { DejureUrl } from "../types/url";

function getDejureUrl(gesetz: string, norm: string): string {
	const lawUrl = DejureUrl.LAW;
	if (dejureGesetze.indexOf(gesetz) !== -1) {
		return `${lawUrl}/${gesetz}/${norm}.html`;
	} else {
		return "";
	}
}

function getLawUrlByProvider(
	gesetz: string,
	norm: string,
	lawProvider: LawProviderOption
): string {
	if (lawProvider === "dejure") {
		return getDejureUrl(gesetz, norm) || "";
	} else {
		return "";
	}
}

function getLawUrlByProviderOptions(
	gesetz: string,
	norm: string,
	lawProviders: LawProviderOptions
): string {
	let lawUrl = getLawUrlByProvider(gesetz, norm, lawProviders.firstOption);

	if (lawUrl) {
		return lawUrl;
	}

	if (lawProviders.secondOption) {
		lawUrl = getLawUrlByProvider(gesetz, norm, lawProviders.secondOption);
		if (lawUrl) {
			return lawUrl;
		}
	}

	if (lawProviders.thirdOption) {
		lawUrl = getLawUrlByProvider(gesetz, norm, lawProviders.thirdOption);
		if (lawUrl) {
			return lawUrl;
		}
	}

	if (lawProviders.forthOption) {
		lawUrl = getLawUrlByProvider(gesetz, norm, lawProviders.forthOption);
		if (lawUrl) {
			return lawUrl;
		}
	}

	if (lawProviders.fifthOption) {
		lawUrl = getLawUrlByProvider(gesetz, norm, lawProviders.fifthOption);
		if (lawUrl) {
			return lawUrl;
		}
	}

	return "";
}

export { getLawUrlByProvider, getLawUrlByProviderOptions };
