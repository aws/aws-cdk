import nodeunit = require('nodeunit');
import { toYAML } from '../lib/serialize';

export = nodeunit.testCase({
  toYAML: {
    'does not wrap lines'(test: nodeunit.Test) {
      const longString = 'Long string is long!'.repeat(1_024);
      test.equal(toYAML({ longString }), `longString: ${longString}\n`);
      test.done();
    }
  }
});
