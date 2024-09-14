import { buzerGesetze } from "../static/buzerGesetze";
import { dejureGesetze } from "../static/dejureGesetze";
import { lexmeaGesetze } from "../static/lexmeaGesetze";
import { lexsoftGesetze } from "../static/lexsoftGesetze";
import { rewisGesetze } from "../static/rewisGesetze";
import { LawProviderOption, LawProviderOptions } from "../types/providerOption";
import { DejureUrl, LawProviderUrl } from "../types/url";

function getDejureUrl(gesetz: string, norm: string): string {
	const lawUrl = DejureUrl.LAW;
	gesetz = gesetz.toLowerCase();
	if (dejureGesetze.indexOf(gesetz) !== -1) {
		return `${lawUrl}${gesetz}/${norm}.html`;
	}
	return "";
}

function getBuzerUrl(gesetz: string, norm: string): string {
	const lawUrl = LawProviderUrl.BUZER;
	gesetz = gesetz.toLowerCase();

	if (buzerGesetze[gesetz] && buzerGesetze[gesetz][norm]) {
		return `${lawUrl}${buzerGesetze[gesetz][norm]}`;
	}
	return "";
}

function getLexmeaUrl(gesetz: string, norm: string): string {
	const lawUrl = LawProviderUrl.LEXMEA;
	gesetz = gesetz.toLowerCase();

	if (lexmeaGesetze.indexOf(gesetz) !== -1) {
		return `${lawUrl}${gesetz}/${norm}`;
	}
	return "";
}

function getLexsoftUrl(gesetz: string, norm: string): string {
	const lawUrl = LawProviderUrl.LEXSOFT;
	gesetz = gesetz.toLowerCase();

	for (const [_, law] of Object.entries(lexsoftGesetze)) {
		if (law[gesetz] && law[gesetz][norm]) {
			return `${lawUrl}${law[gesetz][norm]}`;
		}
	}
	return "";
}

function getRewisUrl(gesetz: string, norm: string): string {
	const lawUrl = LawProviderUrl.REWIS;
	gesetz = gesetz.toLowerCase();

	if (rewisGesetze.indexOf(gesetz) !== -1) {
		gesetz = gesetz
			.replace(/ü/g, "u")
			.replace(/ä/g, "a")
			.replace(/ä/g, "o");
		return `${lawUrl}${gesetz}/p/${norm}-${gesetz}`;
	}
	return "";
}

function getLawUrlByProvider(
	gesetz: string,
	norm: string,
	lawProvider: LawProviderOption
): string {
	if (lawProvider === "dejure") {
		return getDejureUrl(gesetz, norm) || "";
	}
	if (lawProvider === "buzer") {
		return getBuzerUrl(gesetz, norm) || "";
	}
	if (lawProvider === "lexmea") {
		return getLexmeaUrl(gesetz, norm) || "";
	}
	if (lawProvider === "lexsoft") {
		return getLexsoftUrl(gesetz, norm) || "";
	}
	if (lawProvider === "rewis") {
		return getRewisUrl(gesetz, norm) || "";
	}
	return "";
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
