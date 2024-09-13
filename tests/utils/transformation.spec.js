import { expect, test } from "vitest";
import {
	findAndLinkLawReferences,
	findAndLinkCaseReferences,
	findAndLinkJournalReferences,
} from "../../src/utils/transformation";

test.each([
	{
		input: `§ 177 II Nr. 2 StGB `,
		expected: `§ <a href="https://www.dejure.org/gesetze/StGB/177.html">177 II Nr. 2</a> StGB `,
	},
	{
		input: `§ 1 AGBGB`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AGBGB/1.html">1</a> AGBGB`,
	},
	{
		input: `§ 1 AGBG`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AGBG/1.html">1</a> AGBG`,
	},
	{
		input: `§ 1 AGBGB Schl.-H. SH`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AGBGB Schl.-H. SH/1.html">1</a> AGBGB Schl.-H. SH`,
	},
	{
		input: `§ 1 AGVwGO BE`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AGVwGO BE/1.html">1</a> AGVwGO BE`,
	},
	{
		input: `§ 1 AO`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AO/1.html">1</a> AO`,
	},
	{
		input: `§ 1 AO-GS NW`,
		expected: `§ <a href="https://www.dejure.org/gesetze/AO-GS NW/1.html">1</a> AO-GS NW`,
	},
	{
		input: `§ 1 BBesGÜB 2018/19/20`,
		expected: `§ <a href="https://www.dejure.org/gesetze/BBesGÜB 2018/19/20/1.html">1</a> BBesGÜB 2018/19/20`,
	},
	{
		input: `§ 1 BGBAG HH`,
		expected: `§ <a href="https://www.dejure.org/gesetze/BGBAG HH/1.html">1</a> BGBAG HH`,
	},
	{
		input: `meow meow `,
		expected: `meow meow `,
	},
	{
		input: `§ 1 KAGB `,
		expected: `§ <a href="https://www.dejure.org/gesetze/KAGB/1.html">1</a> KAGB `,
	},
	{
		input: `§ 1 KAG `,
		expected: `§ <a href="https://www.dejure.org/gesetze/KAG/1.html">1</a> KAG `,
	},
	{
		input: `§ 1 VVG-InfoV `,
		expected: `§ <a href="https://www.dejure.org/gesetze/VVG-InfoV/1.html">1</a> VVG-InfoV `,
	},
	{
		input: `§ 1 VVG `,
		expected: `§ <a href="https://www.dejure.org/gesetze/VVG/1.html">1</a> VVG `,
	},
	{
		input: `§ 1 VVG a.F. `,
		expected: `§ <a href="https://www.dejure.org/gesetze/VVG a.F./1.html">1</a> VVG a.F. `,
	},
	{
		input: `§ 177 II Nr. 2, 5 StGB`,
		expected: `§ <a href="https://www.dejure.org/gesetze/StGB/177.html">177 II Nr. 2, 5</a> StGB`,
	},
	{
		input: `§ 58 Abs. 3, 6 Nr. 2, 8 LFGB`,
		expected: `§ <a href="https://www.dejure.org/gesetze/LFGB/58.html">58 Abs. 3, 6 Nr. 2, 8</a> LFGB`,
	},
	{
		input: `§ 62 Abs. 1 Nr. 1 LFGB`,
		expected: `§ <a href="https://www.dejure.org/gesetze/LFGB/62.html">62 Abs. 1 Nr. 1</a> LFGB`,
	},
	{
		input: `Art. 1 EuGVÜ`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/EuGVÜ/1.html">1</a> EuGVÜ`,
	},
	{
		input: `§ 24 BGB
	Hallo`,
		expected: `§ <a href="https://www.dejure.org/gesetze/BGB/24.html">24</a> BGB
	Hallo`,
	},
	{
		input: `Art. 80 Abs. 1 Satz 2 GG`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/GG/80.html">80 Abs. 1 Satz 2</a> GG`,
	},
	{
		input: `Art. 80 Abs. 1 Satz 2, 3 GG`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/GG/80.html">80 Abs. 1 Satz 2, <a href="https://www.dejure.org/gesetze/GG/3.html">3</a></a> GG`,
	},
	{
		input: `Art. 1 II lit. a Rom-I-VO`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/Rom-I-VO/1.html">1 II lit. a</a> Rom-I-VO`,
	},
	{
		input: `Art. 1 II lit. a-c Brüssel-Ia-VO`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/EUGVVO/1.html">1 II lit. a-c</a> Brüssel-Ia-VO`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 Abs. 1, <a href="https://www.dejure.org/gesetze/BGB/249.html">249 Abs. 2</a></a>, <a href="https://www.dejure.org/gesetze/BGB/250.html">250 Abs. 3</a> BGB`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3, 260 Abs. 3 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 Abs. 1, <a href="https://www.dejure.org/gesetze/BGB/249.html">249 Abs. 2</a></a>, <a href="https://www.dejure.org/gesetze/BGB/250.html">250 Abs. 3, <a href="https://www.dejure.org/gesetze/BGB/260.html">260 Abs. 3</a></a> BGB`,
	},
	{
		input: `§§ 22 I Nr. 2, 24a II, 26 I BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/22.html">22 I Nr. 2, <a href="https://www.dejure.org/gesetze/BGB/24a.html">24a II</a></a>, <a href="https://www.dejure.org/gesetze/BGB/26.html">26 I</a> BGB`,
	},
	{
		input: `§§ 27 f. BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/27.html">27 f.</a> BGB`,
	},
	{
		input: `§§ 27 ff. BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/27.html">27 ff.</a> BGB`,
	},
	{
		input: `§§ 242 I, II StGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 I, II</a> StGB`,
	},
	{
		input: `§§ 242, 243 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a>, <a href="https://www.dejure.org/gesetze/BGB/243.html">243</a> BGB`,
	},
	{
		input: `§§ 242, 243 SGB I`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/SGB I/242.html">242</a>, <a href="https://www.dejure.org/gesetze/SGB I/243.html">243</a> SGB I`,
	},
	{
		input: `§ 1 SG`,
		expected: `§ <a href="https://www.dejure.org/gesetze/SG/1.html">1</a> SG`,
	},
	{
		input: `§§ 242, 243 JVollzGB I`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/JVollzGB I/242.html">242</a>, <a href="https://www.dejure.org/gesetze/JVollzGB I/243.html">243</a> JVollzGB I`,
	},
	{ input: `§§ 242, 243 SGB`, expected: `§§ 242, 243 SGB` },
	{
		input: `§§ 242 und 244 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a> und <a href="https://www.dejure.org/gesetze/BGB/244.html">244</a> BGB`,
	},
	{
		input: `§§ 242, 243 und 234 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a>, <a href="https://www.dejure.org/gesetze/BGB/243.html">243</a> und <a href="https://www.dejure.org/gesetze/BGB/234.html">234</a> BGB`,
	},
	{
		input: `§§ 242 - 244 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a> - <a href="https://www.dejure.org/gesetze/BGB/244.html">244</a> BGB`,
	},
	{
		input: `§§ 242 - 244 und 255 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a> - <a href="https://www.dejure.org/gesetze/BGB/244.html">244</a> und <a href="https://www.dejure.org/gesetze/BGB/255.html">255</a> BGB`,
	},
	{
		input: `§§ 242, 243, 245 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/242.html">242</a>, <a href="https://www.dejure.org/gesetze/BGB/243.html">243</a>, <a href="https://www.dejure.org/gesetze/BGB/245.html">245</a> BGB`,
	},
	{
		input: `§§ 823 II, 249 I BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 II</a>, <a href="https://www.dejure.org/gesetze/BGB/249.html">249 I</a> BGB`,
	},
	{
		input: `§§ 823 Abs. 1, 249 Abs. 2, 250 Abs. 3 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 Abs. 1, <a href="https://www.dejure.org/gesetze/BGB/249.html">249 Abs. 2</a></a>, <a href="https://www.dejure.org/gesetze/BGB/250.html">250 Abs. 3</a> BGB`,
	},
	{
		input: `§§ 23 I, II Nr. 1, 3, 24 II Nr. 3 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/23.html">23 I, II Nr. 1, <a href="https://www.dejure.org/gesetze/BGB/3.html">3</a>, <a href="https://www.dejure.org/gesetze/BGB/24.html">24 II Nr. 3</a></a> BGB`,
	},
	{
		input: `§§ 242 I, II, 243 I 2 Nr. 1, 22, 23 StGB I`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 I, II</a>, <a href="https://www.dejure.org/gesetze/StGB/243.html">243 I 2 Nr. 1, <a href="https://www.dejure.org/gesetze/StGB/22.html">22</a>, <a href="https://www.dejure.org/gesetze/StGB/23.html">23</a></a> StGB I`,
	},
	{
		input: `§§ 242 Abs.1 S. 3 Nr. 4, 243 Abs. 2 S. 2 Nr. 1, 22, 23 StGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 Abs.1 S. 3 Nr. 4</a>, <a href="https://www.dejure.org/gesetze/StGB/243.html">243 Abs. 2 S. 2 Nr. 1, <a href="https://www.dejure.org/gesetze/StGB/22.html">22</a>, <a href="https://www.dejure.org/gesetze/StGB/23.html">23</a></a> StGB`,
	},
	{
		input: `§§ 23 I, II Nr. 1 lit. a, 24 II Nr. 3, 25 II BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/23.html">23 I, II Nr. 1 lit. a</a>, <a href="https://www.dejure.org/gesetze/BGB/24.html">24 II Nr. 3, <a href="https://www.dejure.org/gesetze/BGB/25.html">25 II</a></a> BGB`,
	},
	{
		input: `§§ 23 I Nr. 1, 24 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/23.html">23 I Nr. 1, <a href="https://www.dejure.org/gesetze/BGB/24.html">24</a></a> BGB`,
	},
	{
		input: `§§ 23 I, 24 II, 25 II BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/23.html">23 I</a>, <a href="https://www.dejure.org/gesetze/BGB/24.html">24 II</a>, <a href="https://www.dejure.org/gesetze/BGB/25.html">25 II</a> BGB`,
	},
	{
		input: `§ 22 I Nr. 2, 24a I a-c, 26 I b Rom-I-VO`,
		expected: `§ <a href="https://www.dejure.org/gesetze/Rom-I-VO/22.html">22 I Nr. 2, 24a I a-c</a>, <a href="https://www.dejure.org/gesetze/Rom-I-VO/26.html">26 I b</a> Rom-I-VO`,
	},
	{
		input: `§§ 242 I, II, 243 I 2 Nr. 1, 22, 23 StGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 I, II</a>, <a href="https://www.dejure.org/gesetze/StGB/243.html">243 I 2 Nr. 1, <a href="https://www.dejure.org/gesetze/StGB/22.html">22</a>, <a href="https://www.dejure.org/gesetze/StGB/23.html">23</a></a> StGB`,
	},
	{
		input: `§§ 242 I, 243 I 2 Nr. 1, 22 I Alt. 1, 23 I StGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 I</a>, <a href="https://www.dejure.org/gesetze/StGB/243.html">243 I 2 Nr. 1, 22</a> I Alt. 1, <a href="https://www.dejure.org/gesetze/StGB/23.html">23 I</a> StGB`,
	},
	{
		input: `§§ 242 I, 243 I, 22 I 1, 25 I 1 Var. 1, 23 I lit. a StGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/StGB/242.html">242 I</a>, <a href="https://www.dejure.org/gesetze/StGB/243.html">243 I</a>, <a href="https://www.dejure.org/gesetze/StGB/22.html">22 I 1, 25</a> I 1 Var. 1, <a href="https://www.dejure.org/gesetze/StGB/23.html">23 I lit. a</a> StGB`,
	},
	{
		input: `Art. 23 I, II Nr. 1, 3, 24 II Nr. 3, 25 II BGB`,
		expected: `Art. <a href="https://www.dejure.org/gesetze/BGB/23.html">23 I, II Nr. 1, <a href="https://www.dejure.org/gesetze/BGB/3.html">3</a>, <a href="https://www.dejure.org/gesetze/BGB/24.html">24 II Nr. 3</a></a>, <a href="https://www.dejure.org/gesetze/BGB/25.html">25 II</a> BGB`,
	},
	{
		input: `Artikel 22 I Nr. 2, 24a II, 26 I BGB`,
		expected: `Artikel <a href="https://www.dejure.org/gesetze/BGB/22.html">22 I Nr. 2, <a href="https://www.dejure.org/gesetze/BGB/24a.html">24a II</a></a>, <a href="https://www.dejure.org/gesetze/BGB/26.html">26 I</a> BGB`,
	},
	{
		input: `§ 823 Abs. 1,  2 und 3 BGB`,
		expected: `§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 Abs. 1,  2 und 3</a> BGB`,
	},
	{
		input: `§§ 823 Abs. 1,  2 und 3 BGB`,
		expected: `§§ <a href="https://www.dejure.org/gesetze/BGB/823.html">823 Abs. 1,  <a href="https://www.dejure.org/gesetze/BGB/2.html">2</a> und <a href="https://www.dejure.org/gesetze/BGB/3.html">3</a></a> BGB`,
	},
])(
	"findAndLinkLawReferences: should transform $input to $expected",
	(testData) => {
		let result = findAndLinkLawReferences(testData.input);
		// Run the transformation twice to ensure that the transformation is idempotent
		result = findAndLinkLawReferences(testData.input);
		expect(result).toBe(testData.expected);
	}
);

test.each([
	{
		input: `meow meow`,
		expected: `meow meow`,
	},
	{
		input: `17 O 11/23 `,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=17 O 11/23">17 O 11/23</a> `,
	},
	{
		input: `2 BvR 829/24`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=2 BvR 829/24">2 BvR 829/24</a>`,
	},
	{
		input: `VIII ZR 184/23`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=VIII ZR 184/23">VIII ZR 184/23</a>`,
	},
	{
		input: `C-184/22`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=C-184/22">C-184/22</a>`,
	},
	{
		input: `B 1 KR 28/23 R`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=B 1 KR 28/23 R">B 1 KR 28/23 R</a>`,
	},
	{
		input: `2 StR 26/12`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=2 StR 26/12">2 StR 26/12</a>`,
	},
	{
		input: `11 Ks 542 Js 24817/09`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=11 Ks 542 Js 24817/09">11 Ks 542 Js 24817/09</a>`,
	},
	{
		input: `57292/16`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=57292/16">57292/16</a>`,
	},
	{
		input: `5a F 686/10`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=5a F 686/10">5a F 686/10</a>`,
	},
])(
	"findAndLinkCaseReferences: should transform $input to $expected",
	(testData) => {
		let result = findAndLinkCaseReferences(testData.input);
		// Run the transformation twice to ensure that the transformation is idempotent
		result = findAndLinkCaseReferences(testData.input);
		expect(result).toBe(testData.expected);
	}
);

test.each([
	{
		input: `meow meow`,
		expected: `meow meow`,
	},
	{
		input: `afp 2019, 555 `,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=afp 2019, 555">afp 2019, 555</a> `,
	},
	{
		input: `NVwZ 2022, 1561`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=NVwZ 2022, 1561">NVwZ 2022, 1561</a>`,
	},
	{
		input: `NJW 2024, 2604`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=NJW 2024, 2604">NJW 2024, 2604</a>`,
	},
	{
		input: `BVerwGE 175, 227`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BVerwGE 175, 227">BVerwGE 175, 227</a>`,
	},
	{
		input: `BGHZ 137, 205`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BGHZ 137, 205">BGHZ 137, 205</a>`,
	},
	{
		input: `BGHSt 40, 299`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BGHSt 40, 299">BGHSt 40, 299</a>`,
	},
	{
		input: `BFHE 251, 40`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BFHE 251, 40">BFHE 251, 40</a>`,
	},
	{
		input: `BAGE 135, 80`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BAGE 135, 80">BAGE 135, 80</a>`,
	},
	{
		input: `BVerfGE 126, 286`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BVerfGE 126, 286">BVerfGE 126, 286</a>`,
	},
	{
		input: `BSGE 123, 157`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=BSGE 123, 157">BSGE 123, 157</a>`,
	},
	{
		input: `Slg. 2003, I-10239`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=Slg. 2003, I-10239">Slg. 2003, I-10239</a>`,
	},
	{
		input: `Slg. 1999, II-3357`,
		expected: `<a href="https://www.dejure.org/dienste/vernetzung/rechtsprechung?Text=Slg. 1999, II-3357">Slg. 1999, II-3357</a>`,
	},
	{
		input: `§§ 280, 328 Nr. 2, 258, 57 BGB`,
		expected: `§§ 280, 328 Nr. 2, 258, 57 BGB`,
	},
])(
	"findAndLinkJournalReferences: should transform $input to $expected",
	(testData) => {
		let result = findAndLinkJournalReferences(testData.input);
		// Run the transformation twice to ensure that the transformation is idempotent
		result = findAndLinkJournalReferences(testData.input);
		expect(result).toBe(testData.expected);
	}
);
