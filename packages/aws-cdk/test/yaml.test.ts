import { deserializeStructure, toYAML } from '../lib/serialize';

// Preferred quote of the YAML library
const q = '"';

test('quote the word "ON"', () => {
  // NON NEGOTIABLE! If not quoted, will be interpreted as the boolean TRUE

  // eslint-disable-next-line no-console
  const output = toYAML({
    notABoolean: 'ON',
  });

  expect(output.trim()).toEqual(`notABoolean: ${q}ON${q}`);
});

test('quote number-like strings with a leading 0', () => {
  const output = toYAML({
    leadingZero: '012345',
  });

  expect(output.trim()).toEqual(`leadingZero: ${q}012345${q}`);
});

test('do not quote octal numbers that arent really octal', () => {
  // This is a contentious one, and something that might have changed in YAML1.2 vs YAML1.1
  //
  // One could make the argument that a sequence of characters that couldn't ever
  // be an octal value doesn't need to be quoted, and pyyaml parses it correctly.
  //
  // However, CloudFormation's parser interprets it as a decimal number (eating the
  // leading 0) if it's unquoted, so that's the behavior we're testing for.

  const output = toYAML({
    leadingZero: '0123456789',
  });

  expect(output.trim()).toEqual(`leadingZero: ${q}0123456789${q}`);
});

test('validate that our YAML correctly emits quoted colons in a list', () => {
  // Must be quoted otherwise it's not valid YAML.
  //
  // 'yaml' fails this.

  const output = toYAML({
    colons: ['arn', ':', 'aws'],
  });

  expect(output.trim()).toEqual([
    'colons:',
    '  - arn',
    `  - ${q}:${q}`,
    '  - aws',
  ].join('\n'));
});

test('validate emission of very long lines', () => {
  const template = {
    Field: ' very long line that starts with a space. very long line that starts with a space. start on a new line',
  };

  const output = toYAML(template);

  const parsed = deserializeStructure(output);

  expect(template).toEqual(parsed);
});
