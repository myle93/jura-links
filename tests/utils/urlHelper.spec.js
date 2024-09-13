import { expect, test } from "vitest";
import { getLawUrlByProvider } from "../../src/utils/urlHelper";

test.each([
	{
		gesetz: `StGB`,
		norm: `242`,
		provider: `dejure`,
		expected: `https://www.dejure.org/gesetze/StGB/242.html`,
	},
])(
	"getLawUrlByProvider: should returns $expected given provider $provider, $gesetz, $norm and $normGroup",
	(testData) => {
		const result = getLawUrlByProvider(
			testData.gesetz,
			testData.norm,
			testData.provider
		);
		expect(result).toBe(testData.expected);
	}
);
