import {describe, expect, test} from '@jest/globals'

describe('Regex Pattern Tests', () => {
  const testCases = [
    {
      input: '§ 58 Abs. 3 Nr. 2 LFGB',
      expected: {
        norm: '58',
        absatz: '3',
        satz: undefined,
        nr: '2',
        lit: undefined,
        gesetz: 'LFGB',
        buch: undefined
      }
    },
    {
      input: 'Art. 80 Abs. 1 Satz 2 GG',
      expected: {
        norm: '80',
        absatz: '1',
        satz: '2',
        nr: undefined,
        lit: undefined,
        gesetz: 'GG',
        buch: undefined
      }
    },
    {
      input: 'Artikel 123 lit. a BGB',
      expected: {
        norm: '123',
        absatz: undefined,
        satz: undefined,
        nr: undefined,
        lit: 'a',
        gesetz: 'BGB',
        buch: undefined
      }
    },
    {
      input: '§ 62 Abs. 1 Nr. 1 LFGB',
      expected: {
        norm: '62',
        absatz: '1',
        satz: undefined,
        nr: '1',
        lit: undefined,
        gesetz: 'LFGB',
        buch: undefined
      }
    }
  ];

  testCases.forEach(({ input, expected }) => {
    const regexPattern = new RegExp(
      `(§+|Art|Artikel)\.?\s*(?<norm>\d+(?:\w\b)?)\s*(?:Abs\.\s*(?<absatz>\d+(?:\w\b)?))?\s*(?:S\.\s*(?<satz>\d+))?\s*(?:Nr\.\s*(?<nr>\d+(?:\w\b)?))?\s*(?:lit\.\s*(?<lit>[a-z]?))?.{0,10}?(?<gesetz>\b[A-Z][A-Za-z]*[A-Z](?:(?<buch>(?:\s|\b)[XIV]+)?))`,
      'gi'
      );
    test(`should match and capture groups for input: "${input}"`, () => {
      const match = input.match(regexPattern);
      expect(match).not.toBeNull();
      if (match) {
        const groups = match.groups;
        expect(groups).toEqual(expected);
      }
    });
  });
});
