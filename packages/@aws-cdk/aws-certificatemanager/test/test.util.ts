import { Test } from 'nodeunit';
import { apexDomain } from '../lib/util';

export = {
  'apex domain returns right domain'(test: Test) {
    test.equals('domain.com', apexDomain('domain.com'));
    test.equals('domain.com', apexDomain('test.domain.com'));
    test.done();
  },

  'apex domain understands eTLDs'(test: Test) {
    test.equals('domain.co.uk', apexDomain('test.domain.co.uk'));
    test.done();
  }
};
