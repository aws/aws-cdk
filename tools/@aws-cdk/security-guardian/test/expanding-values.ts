/**
 * Condition values that are small in a template but expand to far more text or strings than their
 * size: the verdict must judge each of them not fixed, quickly and within bounded memory.
 */
export const expandingValues = {
  /** Fn::Select over Fn::Split of a Fn::Sub that doubles its variable 26 times, about 1 KB */
  nestedSubUnderSplit(): unknown {
    let value: unknown = 'vpce-1a2b3c4d';
    for (let i = 0; i < 26; i++) {
      value = { 'Fn::Sub': ['${A}${A}', { A: value }] };
    }
    return { 'Fn::Select': ['0', { 'Fn::Split': [',', value] }] };
  },

  /** Fn::Select over Fn::Split of a Fn::Sub with 20,000 references to a 6,500-part Fn::Join, about 110 KB */
  repeatedJoinUnderSplit(): unknown {
    return {
      'Fn::Select': ['0', { 'Fn::Split': ['|', { 'Fn::Sub': ['vpce-' + '${A}'.repeat(20000), { A: { 'Fn::Join': ['', Array(6500).fill('ab')] } }] }] }],
    };
  },

  /** Fn::Join of a part with 256 strings followed by 100,000 literals, about 400 KB */
  longJoinAfterWidePart(): unknown {
    return { 'Fn::Join': ['', [{ 'Fn::Select': ['0', Array.from({ length: 256 }, (_, i) => `vpce-${i}`)] }, ...Array(100000).fill('a')]] };
  },

  /** A literal Fn::Sub that doubles its variable 40 times, about 1.4 KB, whose one string is far longer than any policy */
  doublingSub(levels = 40): unknown {
    return doubled('vpce-1a2b3c4d', levels);
  },

  /** Fn::Sub of "vpce-${AWS::StackId}" repeated 1,000 times, about 20 KB: 1,000 deploy-time values in one string */
  stackIdRepeats(): unknown {
    return { 'Fn::Sub': 'vpce-${AWS::StackId}'.repeat(1000) };
  },

  /** Fn::ImportValue of a 10,000-character export name, doubled 16 times by Fn::Sub, about 19 KB */
  importValueDoubled(): unknown {
    return doubled({ 'Fn::ImportValue': 'n'.repeat(10000) }, 16);
  },
};

/** `value` doubled `levels` times by a literal Fn::Sub */
function doubled(value: unknown, levels: number): unknown {
  let result = value;
  for (let i = 0; i < levels; i++) {
    result = { 'Fn::Sub': ['${A}${A}', { A: result }] };
  }
  return result;
}

/**
 * A Ref to a parameter whose AllowedValues hold one short value and whose Default is 70,000
 * characters, doubled 13 times: the verdict reads the short value, the preprocessor the Default
 */
export function defaultDoubled(): { parameters: Record<string, unknown>; value: unknown } {
  return {
    parameters: { P: { Type: 'String', AllowedValues: ['vpce-1'], Default: 'd'.repeat(70000) } },
    value: doubled({ Ref: 'P' }, 13),
  };
}

/** `count` spellings of `key` in different letter cases, which IAM reads as the same condition key */
export function caseVariants(key: string, count: number): string[] {
  const letters = [...key].flatMap((character, index) => (/[a-z]/i.test(character) ? [index] : []));
  return Array.from({ length: count }, (_, n) => [...key]
    .map((character, index) => {
      const bit = letters.indexOf(index);
      return bit >= 0 && (n >> bit) & 1 ? character.toUpperCase() : character.toLowerCase();
    })
    .join(''));
}

const longText = (length: number, suffix: string) => 'v'.repeat(length - suffix.length) + suffix;

/**
 * Templates of several megabytes whose judging reads the same template data many times: the
 * verdict must charge each read, so that each Condition is judged not fixed quickly.
 */
export const largeTemplates = {
  /** Condition entries that each refer to a parameter whose AllowedValues hold many strings and then a number */
  parameterListRefs(values: number, refs: number) {
    return {
      template: { Parameters: { P: { Type: 'String', AllowedValues: [...Array.from({ length: values }, (_, i) => `vpce-${i}`), 1] } } },
      condition: { StringEquals: Object.fromEntries(caseVariants('aws:PrincipalOrgID', refs).map(key => [key, { Ref: 'P' }])) },
    };
  },

  /** Many references to a parameter whose one value is a long literal, read after a mapping of long literals of the same length */
  longLiteralRefs(refs: number, entries: number, length: number) {
    return {
      template: {
        Parameters: { P: { Type: 'String', AllowedValues: [longText(length, 'P')] } },
        Mappings: { M: { T: Object.fromEntries(Array.from({ length: entries }, (_, i) => [`e${i}`, longText(length, `-${i}`)])) } },
      },
      condition: {
        StringEquals: {
          'aws:SourceVpce': [{ Ref: 'P' }, '*'],
          'AWS:SOURCEVPCE': { 'Fn::FindInMap': ['M', 'T', { Ref: 'AWS::Region' }] },
          'Aws:SourceVpce': Array(refs).fill({ Ref: 'P' }),
        },
      },
    };
  },

  /** Fn::FindInMap lookups with a non-literal top key over a large mapping, none of which finds its second key */
  findInMapMisses(lookups: number, entries: number) {
    return {
      template: { Mappings: { M: Object.fromEntries(Array.from({ length: entries }, (_, i) => [`k${i}`, { x: 'vpce-1a2b3c4d' }])) } },
      condition: { StringEquals: Object.fromEntries(caseVariants('aws:SourceVpce', lookups).map(key => [key, { 'Fn::FindInMap': ['M', { Ref: 'AWS::Region' }, 'missing'] }])) },
    };
  },

  /** Fn::FindInMap lookups with non-literal keys over a large mapping of empty entries, so that only the entries visited cost work */
  emptyEntryLookups(lookups: number, entries: number) {
    return {
      template: { Mappings: { M: Object.fromEntries(Array.from({ length: entries }, (_, i) => [`k${i}`, {}])) } },
      condition: {
        StringEquals: Object.fromEntries(caseVariants('aws:SourceVpce', lookups).map(key => [key, { 'Fn::FindInMap': ['M', { Ref: 'AWS::Region' }, { Ref: 'AWS::Region' }] }])),
      },
    };
  },

  /** Many references to a parameter whose one value is a long literal */
  longLiteralReads(refs: number, length: number) {
    return {
      template: { Parameters: { P: { Type: 'String', AllowedValues: [longText(length, 'P')] } } },
      condition: { StringEquals: { 'aws:SourceVpce': [...Array(refs).fill({ Ref: 'P' }), '*'] } },
    };
  },

  /** Fn::Split over a Fn::Sub with many references to a long literal */
  splitOfLongLiteral(refs: number, length: number) {
    return {
      template: {},
      condition: { StringEquals: { 'aws:SourceVpce': { 'Fn::Select': ['0', { 'Fn::Split': [',', { 'Fn::Sub': ['${A}'.repeat(refs), { A: longText(length, 'x') }] }] }] } } },
    };
  },
};
