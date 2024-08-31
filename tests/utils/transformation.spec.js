import { expect, test } from "vitest";
import { findAndLinkLawReferences } from "../../src/utils/transformation";

test.each([
	{
		input: `§ 177 II Nr. 2 StGB `,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/177.html">177 II Nr. 2</a> StGB</span> `,
	},
	{
		input: `§ 177 II Nr. 2, 5 StGB`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/177.html">177 II Nr. 2, 5</a> StGB</span>`,
	},
	{
		input: `§ 58 Abs. 3, 6 Nr. 2, 8 LFGB`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/lfgb/58.html">58 Abs. 3, 6 Nr. 2, 8</a> LFGB</span>`,
	},
	{
		input: `§ 62 Abs. 1 Nr. 1 LFGB`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/lfgb/62.html">62 Abs. 1 Nr. 1</a> LFGB</span>`,
	},
	{
		input: `Art. 1 EuGVÜ`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/eugvue/1.html">1</a> EuGVÜ</span>`,
	},
	{
		input: `§ 24 BGB
	Hallo`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24</a> BGB</span>
	Hallo`,
	},
	{
		input: `Art. 80 Abs. 1 Satz 2 GG`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/gg/80.html">80 Abs. 1 Satz 2</a> GG</span>`,
	},
	{
		input: `Art. 80 Abs. 1 Satz 2, 3 GG`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/gg/80.html">80 Abs. 1 Satz 2, <a class="no-underline" href="https://www.dejure.org/gesetze/gg/3.html">3</a></a> GG</span>`,
	},
	{
		input: `Art. 1 II lit. a Rom-I-VO`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/rom-i-vo/1.html">1 II lit. a</a> Rom-I-VO</span>`,
	},
	{
		input: `Art. 1 II lit. a-c Brüssel-Ia-VO`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/eugvvo/1.html">1 II lit. a-c</a> Brüssel-Ia-VO</span>`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 Abs. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/249.html">249 Abs. 2</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/250.html">250 Abs. 3</a> BGB</span>`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3, 260 Abs. 3 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 Abs. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/249.html">249 Abs. 2</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/250.html">250 Abs. 3, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/260.html">260 Abs. 3</a></a> BGB</span>`,
	},
	{
		input: `§§ 22 I Nr. 2, 24a II, 26 I BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/22.html">22 I Nr. 2, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24a.html">24a II</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/26.html">26 I</a> BGB</span>`,
	},
	{
		input: `§§ 27 f. BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/27.html">27 f.</a> BGB</span>`,
	},
	{
		input: `§§ 27 ff. BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/27.html">27 ff.</a> BGB</span>`,
	},
	{
		input: `§§ 242 I, II StGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 I, II</a> StGB</span>`,
	},
	{
		input: `§§ 242, 243 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/243.html">243</a> BGB</span>`,
	},
	{
		input: `§§ 242, 243 SGB I`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/sgb_I/242.html">242</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/sgb_I/243.html">243</a> SGB I</span>`,
	},
	{ input: `§§ 242, 243 SGB`, expected: `§§ 242, 243 SGB` },
	{
		input: `§§ 242 und 244 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a> und <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/244.html">244</a> BGB</span>`,
	},
	{
		input: `§§ 242, 243 und 234 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/243.html">243</a> und <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/234.html">234</a> BGB</span>`,
	},
	{
		input: `§§ 242 - 244 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a> - <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/244.html">244</a> BGB</span>`,
	},
	{
		input: `§§ 242 - 244 und 255 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a> - <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/244.html">244</a> und <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/255.html">255</a> BGB</span>`,
	},
	{
		input: `§§ 242, 243, 245 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/242.html">242</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/243.html">243</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/245.html">245</a> BGB</span>`,
	},
	{
		input: `§§ 823 II, 249 I BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 II</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/249.html">249 I</a> BGB</span>`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 Abs. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/249.html">249 Abs. 2</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/250.html">250 Abs. 3</a> BGB</span>`,
	},
	{
		input: `§§ 23 I, II Nr. 1, 3, 24 II Nr. 3 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/23.html">23 I, II Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/3.html">3</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24 II Nr. 3</a></a> BGB</span>`,
	},
	{
		input: `§§ 242 I, II, 243 I 2 Nr. 1, 22, 23 StGB I`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 I, II</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/243.html">243 I 2 Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/22.html">22</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/23.html">23</a></a> StGB</span> I`,
	},
	{
		input: `§§ 242 Abs.1 S. 3 Nr. 4, 243 Abs. 2 S. 2 Nr. 1, 22, 23 StGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 Abs.1 S. 3 Nr. 4</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/243.html">243 Abs. 2 S. 2 Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/22.html">22</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/23.html">23</a></a> StGB</span>`,
	},
	{
		input: `§§ 23 I, II Nr. 1 lit. a, 24 II Nr. 3, 25 II BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/23.html">23 I, II Nr. 1 lit. a</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24 II Nr. 3, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/25.html">25 II</a></a> BGB</span>`,
	},
	{
		input: `§§ 23 I Nr. 1, 24 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/23.html">23 I Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24</a></a> BGB</span>`,
	},
	{
		input: `§§ 23 I, 24 II, 25 II BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/23.html">23 I</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24 II</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/25.html">25 II</a> BGB</span>`,
	},
	{
		input: `§ 22 I Nr. 2, 24a I a-c, 26 I b Rom-I-VO`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/rom-i-vo/22.html">22 I Nr. 2, 24a I a-c</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/rom-i-vo/26.html">26 I b</a> Rom-I-VO</span>`,
	},
	{
		input: `§§ 242 I, II, 243 I 2 Nr. 1, 22, 23 StGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 I, II</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/243.html">243 I 2 Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/22.html">22</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/23.html">23</a></a> StGB</span>`,
	},
	{
		input: `§§ 242 I, 243 I 2 Nr. 1, 22 I Alt. 1, 23 I StGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 I</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/243.html">243 I 2 Nr. 1, 22</a> I Alt. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/23.html">23 I</a> StGB</span>`,
	},
	{
		input: `§§ 242 I, 243 I, 22 I 1, 25 I 1 Var. 1, 23 I lit. a StGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/242.html">242 I</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/243.html">243 I</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/22.html">22 I 1, 25</a> I 1 Var. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/stgb/23.html">23 I lit. a</a> StGB</span>`,
	},
	{
		input: `Art. 23 I, II Nr. 1, 3, 24 II Nr. 3, 25 II BGB`,
		expected: `<span style="color: #a159e4;">Art. <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/23.html">23 I, II Nr. 1, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/3.html">3</a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24.html">24 II Nr. 3</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/25.html">25 II</a> BGB</span>`,
	},
	{
		input: `Artikel 22 I Nr. 2, 24a II, 26 I BGB`,
		expected: `<span style="color: #a159e4;">Artikel <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/22.html">22 I Nr. 2, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/24a.html">24a II</a></a>, <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/26.html">26 I</a> BGB</span>`,
	},
	{
		input: `§ 823 Abs. 1,  2 und 3 BGB`,
		expected: `<span style="color: #a159e4;">§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 Abs. 1,  2 und 3</a> BGB</span>`,
	},
	{
		input: `§§ 823 Abs. 1,  2 und 3 BGB`,
		expected: `<span style="color: #a159e4;">§§ <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/823.html">823 Abs. 1,  <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/2.html">2</a> und <a class="no-underline" href="https://www.dejure.org/gesetze/bgb/3.html">3</a></a> BGB</span>`,
	},
])("findAndLinkLawReferences: should transform %s to %s", (testData) => {
	const result = findAndLinkLawReferences(testData.input);
	expect(testData.expected).toBe(result);
});
