import { Test } from 'nodeunit';

import * as util from '../lib/util';

export = {
  'throws when zone name ending with a \'.\''(test: Test) {
    test.throws(() => util.validateZoneName('zone.name.'), /trailing dot/);
    test.done();
  },
  'accepts a valid domain name'(test: Test) {
    const domainName = 'amazonaws.com';
    util.validateZoneName(domainName);
    test.done();
  }
};
