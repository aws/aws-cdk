import { Test } from 'nodeunit';
import { fromYAML, toYAML } from '../lib/serialize';

// Preferred quote of the YAML library
const q = '"';

export = {
  'quote the word "ON"'(test: Test) {
    // NON NEGOTIABLE! If not quoted, will be interpreted as the boolean TRUE

    // eslint-disable-next-line no-console
    const output = toYAML({
      notABoolean: "ON"
    });

    test.equals(output.trim(), `notABoolean: ${q}ON${q}`);

    test.done();
  },

  'quote number-like strings with a leading 0'(test: Test) {
    const output = toYAML({
      leadingZero: "012345"
    });

    test.equals(output.trim(), `leadingZero: ${q}012345${q}`);

    test.done();
  },

  'do not quote octal numbers that arent really octal'(test: Test) {
    // This is a contentious one, and something that might have changed in YAML1.2 vs YAML1.1
    //
    // One could make the argument that a sequence of characters that couldn't ever
    // be an octal value doesn't need to be quoted, and pyyaml parses it correctly.
    //
    // However, CloudFormation's parser interprets it as a decimal number (eating the
    // leading 0) if it's unquoted, so that's the behavior we're testing for.

    const output = toYAML({
      leadingZero: "0123456789"
    });

    test.equals(output.trim(), `leadingZero: ${q}0123456789${q}`);

    test.done();
  },

  'validate that our YAML correctly emits quoted colons in a list'(test: Test) {
    // Must be quoted otherwise it's not valid YAML.
    //
    // 'yaml' fails this.

    const output = toYAML({
      colons: ['arn', ':', 'aws']
    });

    test.equals(output.trim(), [
      'colons:',
      '  - arn',
      `  - ${q}:${q}`,
      '  - aws'
    ].join('\n'));

    test.done();
  },

  'validate emission of very long lines'(test: Test) {
    const template = {
      Field: ' very long line that starts with a space. very long line that starts with a space. start on a new line'
    };

    const output = toYAML(template);

    const parsed = fromYAML(output);

    test.deepEqual(template, parsed);

    test.done();
  }
};
