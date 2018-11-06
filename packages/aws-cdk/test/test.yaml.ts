import { Test } from 'nodeunit';

import YAML = require('js-yaml');

function yamlStringify(obj: any) {
  return YAML.dump(obj);
}

export = {
  'quote the word "ON"'(test: Test) {
    // NON NEGOTIABLE! If not quoted, will be interpreted as the boolean TRUE

    // tslint:disable-next-line:no-console
    const output = yamlStringify({
      notABoolean: "ON"
    });

    test.equals(output.trim(), `notABoolean: 'ON'`);

    test.done();
  },

  'quote number-like strings with a leading 0'(test: Test) {
    const output = yamlStringify({
      leadingZero: "012345"
    });

    test.equals(output.trim(), `leadingZero: '012345'`);

    test.done();
  },

  'do not quote octal numbers that arent really octal'(test: Test) {
    // Under contention: this seems to be okay, pyyaml parses it
    // correctly. Unsure of what CloudFormation does about it.

    const output = yamlStringify({
      leadingZero: "0123456789"
    });

    test.equals(output.trim(), `leadingZero: 0123456789`);

    test.done();
  },

  'validate that our YAML correctly emits quoted colons in a list'(test: Test) {
    // Must be quoted otherwise it's not valid YAML.
    //
    // 'yaml' fails this.

    const output = yamlStringify({
      colons: ['arn', ':', 'aws']
    });

    test.equals(output.trim(), [
      'colons:',
      '  - arn',
      `  - ':'`,
      '  - aws'
    ].join('\n'));

    test.done();
  },
};
