import { Test } from 'nodeunit';
import YAML = require('yaml');

export = {
  'validate that our YAML quotes the word "ON"'(test: Test) {
    // tslint:disable-next-line:no-console
    const output = YAML.stringify({
      notABoolean: "ON"
    }, { schema: 'yaml-1.1' });

    test.equals(output.trim(), 'notABoolean: "ON"');

    test.done();
  },

  'validate that our YAML correctly quotes strings with a leading zero'(test: Test) {
    const output = YAML.stringify({
      leadingZero: "0123456789"
    } , { schema: 'yaml-1.1' });

    test.equals(output.trim(), 'leadingZero: "0123456789"');

    test.done();
  },

  'validate that our YAML correctly parses strings with a leading zero'(test: Test) {
    const output = YAML.parse('leadingZero: "0123456789"', { schema: 'yaml-1.1' });

    test.deepEqual(output, { leadingZero: '0123456789' });

    test.done();
  },
};