import { expect, test } from "vitest";
import { getLawUrlByProvider } from "../../src/utils/urlHelper";

test.each([
	{
		gesetz: `stgb`,
		norm: `242`,
		provider: `dejure`,
		expected: `https://www.dejure.org/gesetze/stgb/242.html`,
	},
	{
		gesetz: `GG`,
		norm: `1`,
		provider: `buzer`,
		expected: `https://www.buzer.de/1_GG.htm`,
	},
	{
		gesetz: `BGB`,
		norm: `2`,
		provider: `lexmea`,
		expected: `https://lexmea.de/gesetz/bgb/2`,
	},
	{
		gesetz: `arbgg bw`,
		norm: `2`,
		provider: `lexsoft`,
		expected: `https://www.lexsoft.de/cgi-bin/lexsoft/justizportal_nrw.cgi?xid=173644,3`,
	},
	{
		gesetz: `AVBFernwärmeV`,
		norm: `1`,
		provider: `rewis`,
		expected: `https://rewis.io/gesetze/avbfernwarmev/p/1-avbfernwarmev`,
	},
])(
	"getLawUrlByProvider: should returns $expected given $provider, $gesetz, $norm",
	(testData) => {
		const result = getLawUrlByProvider(
			testData.gesetz,
			testData.norm,
			testData.provider
		);
		expect(result).toBe(testData.expected);
	}
);
